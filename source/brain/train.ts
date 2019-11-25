import * as tf from "@tensorflow/tfjs-node";
import { ISamples } from "./createSamples";

export default async (samples: ISamples): Promise<void> => {
  const sizeTrain = samples.x.length * 0.7;

  const xTrain = tf.tensor3d(samples.x.slice(0, sizeTrain));
  const yTrain = tf.tensor2d(samples.y.slice(0, sizeTrain));

  const xTest = tf.tensor3d(samples.x.slice(sizeTrain, samples.x.length));
  const yTest = tf.tensor2d(samples.y.slice(sizeTrain, samples.y.length));

  const model = tf.sequential({
    layers: [
      tf.layers.lstm({
        inputShape: [9, 9],
        units: 81,
        returnSequences: true
      }),
      tf.layers.dropout({ rate: 0.2 }),
      tf.layers.lstm({
        units: 162,
        returnSequences: true
      }),
      tf.layers.dropout({ rate: 0.2 }),
      tf.layers.lstm({
        units: 81,
        returnSequences: false
      }),
      tf.layers.dropout({ rate: 0.2 }),
      tf.layers.dense({ units: 9, activation: "linear" })
    ]
  });

  model.compile({
    optimizer: "adam",
    loss: tf.losses.meanSquaredError,
    metrics: tf.metrics.meanSquaredError
  });

  await model
    .fit(xTrain, yTrain, {
      epochs: 50,
      shuffle: false,
      validationData: [xTest, yTest]
    })
    .then(() => console.log("Нейронная сеть успешно обучена."))
    .catch(() => console.log("Не удалось обучить нейронную сеть"));

  await model
    .save("file://./model")
    .then(() => console.log("Снимок нейронной сети успешно сохранён."))
    .catch(() => console.log("Не удалось сохранить снимок нейронной сети."));
};
