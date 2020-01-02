import * as tf from "@tensorflow/tfjs-node";
import path from "path";
import _ from "lodash";
import fs from "fs";
import { ICandle, ISamples, ICoreConfig } from "./types";

export default class Core {
  private model: tf.LayersModel;
  private config: ICoreConfig;

  constructor(config: ICoreConfig) {
    this.config = config;
    this.model = tf.sequential({
      layers: [
        tf.layers.lstm({
          inputShape: [config.previousSeq, config.numberOfParameters],
          activation: "relu",
          units: 32,
          returnSequences: true
        }),

        tf.layers.lstm({
          activation: "relu",
          units: 32,
          returnSequences: true
        }),

        tf.layers.lstm({
          activation: "relu",
          units: 32
        }),

        tf.layers.dense({
          activation: "linear",
          units: config.futureSeq * config.numberOfParameters
        }),

        tf.layers.reshape({
          targetShape: [config.futureSeq, config.numberOfParameters]
        })
      ]
    });

    this.model.compile({
      optimizer: tf.train.adam(),
      loss: tf.metrics.meanAbsolutePercentageError,
      metrics: tf.metrics.meanAbsolutePercentageError
    });

    this.model.summary();
  }

  public train = async (samples: ISamples): Promise<void> => {
    const xsTrain = _.take(samples.xs, (samples.xs.length / 100) * 90);
    const ysTrain = _.take(samples.ys, (samples.ys.length / 100) * 90);
    const xsEvaluate = _.difference(samples.xs, xsTrain);
    const ysEvaluate = _.difference(samples.ys, ysTrain);

    await this.model.fit(tf.tensor3d(xsTrain), tf.tensor3d(ysTrain), {
      epochs: 500,
      shuffle: false,
      batchSize: 1024,
      validationSplit: 0.25,
      callbacks: tf.callbacks.earlyStopping({ verbose: 1, patience: 2 })
    });

    const [loss, accuracy] = this.evaluate(
      tf.tensor3d(xsEvaluate),
      tf.tensor3d(ysEvaluate)
    );

    console.log(
      `Завершено обучение нейронной сети.
        - потери: ${loss},
        - точность: ${accuracy}`
    );

    await this.saveModel();
  };

  public createSamples = (
    candles: ICandle[],
    previousSeq: number = this.config.previousSeq
  ): ISamples => {
    const samples: ISamples = { xs: [], ys: [] };
    const arrayCandles = candles.map(c => _.values(c));

    for (let count = previousSeq; count < arrayCandles.length; count++) {
      samples.xs.push(arrayCandles.slice(count - previousSeq, count));
      samples.ys.push(arrayCandles.slice(count, count + 1));
    }

    return samples;
  };

  private evaluate = (xs: tf.Tensor, ys: tf.Tensor): [number, number] => {
    const [loss, accuracy] = this.model.evaluate(xs, ys) as tf.Scalar[];
    return [loss.arraySync().valueOf(), accuracy.arraySync().valueOf()];
  };

  public predict = (candles: ICandle[]): ICandle[] => {
    const array = candles
      .slice(candles.length - this.config.previousSeq, candles.length)
      .map(c => _.values(c));

    const [result] = (this.model.predict(
      tf.tensor3d([array])
    ) as tf.Tensor3D).arraySync();

    return result.map(c => _.zipObject(_.keys(candles[0]), c)) as ICandle[];
  };

  public loadModelIfExist = async (): Promise<boolean> => {
    try {
      if (fs.existsSync("./model")) {
        this.model = await tf.loadLayersModel("file://model/model.json");
        this.config = JSON.parse(fs.readFileSync("./model/core.json", "utf8"));

        console.log("Модель успешно загружена.");
        return true;
      }
    } catch ({ message }) {
      console.error(`Не удалось загрузить модель: ${message}.`);
    }
    return false;
  };

  public saveModel = async (): Promise<void> => {
    try {
      const raw = JSON.stringify(this.config);

      await this.model.save("file://model");
      fs.writeFileSync("./model/core.json", raw, "utf8");

      console.log("Модель успешно сохранена.");
    } catch ({ message }) {
      console.error(`Не удалось сохранить модель: ${message}.`);
    }
  };

  public scale = (tensor: tf.Tensor): [tf.Scalar, tf.Scalar] => [
    tensor.min(),
    tensor.max()
  ];

  public normalize = (
    tensor: tf.Tensor,
    scale: [tf.Scalar, tf.Scalar] = [tf.scalar(0), tf.scalar(20000)]
  ): tf.Tensor => {
    const [min, max] = scale;
    return tensor.sub(min).div(max.sub(min));
  };

  public denormalize = (
    tensor: tf.Tensor,
    scale: [tf.Scalar, tf.Scalar] = [tf.scalar(0), tf.scalar(20000)]
  ): tf.Tensor => {
    const [min, max] = scale;
    return tensor.mul(max.sub(min)).add(min);
  };
}
