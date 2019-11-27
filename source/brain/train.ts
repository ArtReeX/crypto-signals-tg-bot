import * as tf from "@tensorflow/tfjs-node";
import { ISamples } from "./types";
import getConfig from "../config";

const run = async (
  samples: ISamples,
  epochs: number = getConfig().tensorflow.epochs
): Promise<void> => {
  try {
    const sizeTrain = Math.ceil(samples.x.length * 0.7);

    const xTrain = tf.constraints
      .minMaxNorm({ minValue: 0, maxValue: 1 })
      .apply(tf.tensor3d(samples.x));
    const yTrain = tf.tensor2d(samples.y);

    const model = tf.sequential({
      layers: [
        tf.layers.lstm({
          inputShape: [samples.x[0].length, samples.x[0][0].length],
          units: samples.x[0].length * samples.x[0][0].length,
          returnSequences: true
        }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.batchNormalization(),

        tf.layers.lstm({
          units: samples.x[0].length * samples.x[0][0].length * 2,
          returnSequences: true
        }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.batchNormalization(),

        tf.layers.lstm({
          units: samples.x[0].length * samples.x[0][0].length,
          returnSequences: false
        }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.batchNormalization(),

        tf.layers.dense({
          units: samples.y[0].length,
          activation: "softmax"
        })
      ]
    });

    model.compile({
      optimizer: "adam",
      loss: tf.metrics.categoricalCrossentropy,
      metrics: tf.metrics.categoricalAccuracy
    });

    await model.fit(xTrain, yTrain, {
      epochs,
      batchSize: 64,
      validationSplit: 0.3,
      callbacks: {
        onTrainBegin: () =>
          console.info(
            `Neural network training based on ${sizeTrain} templates has been launched.`
          ),
        onTrainEnd: () => console.info("Neural network training completed.")
      }
    });

    try {
      await model.save("file://./model");
      console.info("Neural network snapshot saved successfully.");
    } catch ({ message }) {
      throw new Error(`Failed to save snapshot of neural network: ${message}`);
    }
  } catch ({ message }) {
    throw new Error(`Failed to train the neural network: ${message}`);
  }
};

export default { run };
