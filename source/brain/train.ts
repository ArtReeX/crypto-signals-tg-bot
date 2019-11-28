import * as tf from "@tensorflow/tfjs-node";
import { ISamples } from "./types";
import getConfig from "../config";
import norm from "./normalization";
import { Tensor1D, Tensor, Rank } from "@tensorflow/tfjs-node";

const run = async (
  samples: ISamples,
  epochs: number = getConfig().tensorflow.epochs
): Promise<void> => {
  try {
    const scale = norm.scale3d(samples.x);

    const xTrain = tf.tensor3d(norm.normalize3d(samples.x, scale));
    const yTrain = tf.tensor2d(samples.y);

    const model = tf.sequential({
      layers: [
        tf.layers.flatten({ inputShape: [xTrain.shape[1], xTrain.shape[2]] }),

        tf.layers.dense({
          units: xTrain.shape[1] * xTrain.shape[2],
          activation: "relu"
        }),
        tf.layers.dropout({ rate: 0.2 }),

        tf.layers.dense({
          units: yTrain.shape[1],
          activation: "softmax"
        })
      ]
    });

    model.summary();

    model.compile({
      optimizer: tf.train.adam(0.01),
      loss: tf.metrics.categoricalCrossentropy,
      metrics: tf.metrics.categoricalAccuracy
    });

    await model.fit(xTrain, yTrain, {
      epochs,
      shuffle: false,
      batchSize: 64,
      validationSplit: 0.3,
      callbacks: {
        onTrainBegin: () =>
          console.info(
            `The neural network began training based on ${xTrain.shape[0]} templates.`
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
