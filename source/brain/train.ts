import * as tf from "@tensorflow/tfjs-node";
import { ISamples } from "./createSamples";
import getConfig from "../getConfig";

export default async (
  samples: ISamples,
  epochs: number = getConfig().tensorflow.epochs
): Promise<void> => {
  const sizeTrain = samples.x.length * 0.7;

  const xTrain = tf.tensor3d(samples.x.slice(0, sizeTrain));
  const yTrain = tf.tensor2d(samples.y.slice(0, sizeTrain));

  const xTest = tf.tensor3d(samples.x.slice(sizeTrain, samples.x.length));
  const yTest = tf.tensor2d(samples.y.slice(sizeTrain, samples.y.length));

  const model = tf.sequential({
    layers: [
      tf.layers.lstm({
        inputShape: [samples.x[0][0].length, samples.x[0][0].length],
        units: samples.x[0].length * samples.x[0][0].length,
        returnSequences: true
      }),
      tf.layers.dropout({ rate: 0.2 }),
      tf.layers.lstm({
        units: samples.x[0].length * samples.x[0][0].length * 2,
        returnSequences: true
      }),
      tf.layers.dropout({ rate: 0.2 }),
      tf.layers.lstm({
        units: samples.x[0].length * samples.x[0][0].length,
        returnSequences: false
      }),
      tf.layers.dropout({ rate: 0.2 }),
      tf.layers.dense({ units: samples.x[0][0].length, activation: "linear" })
    ]
  });

  model.compile({
    optimizer: "adam",
    loss: tf.losses.meanSquaredError,
    metrics: tf.metrics.meanSquaredError
  });

  await model
    .fit(xTrain, yTrain, {
      epochs,
      shuffle: false,
      validationData: [xTest, yTest],
      callbacks: {
        onTrainBegin: () => console.log("Neural network training started."),
        onTrainEnd: () => console.log("Neural network training completed.")
      }
    })
    .then(async () => await saveModel(model))
    .catch(({ message }: Error) =>
      console.log(`Failed to train the neural network: ${message}`)
    );
};

const saveModel = async (model: tf.Sequential): Promise<void> =>
  await model
    .save("file://./model")
    .then(() =>
      console.log("A snapshot of the neural network was successfully saved.")
    )
    .catch(({ message }: Error) =>
      console.log(`Failed to save snapshot of neural network: ${message}`)
    );
