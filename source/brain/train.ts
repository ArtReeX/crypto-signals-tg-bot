import * as tf from "@tensorflow/tfjs-node";
import { ISamples } from "./types";
import getConfig from "../config";

const run = async (
  model: tf.Sequential,
  samples: ISamples,
  epochs: number = getConfig().tensorflow.epochs
): Promise<tf.History> => {
  try {
    const xsTrain = tf.tensor3d(samples.xs);
    const ysTrain = tf.tensor3d(samples.ys);

    return model.fit(xsTrain, ysTrain, {
      epochs,
      shuffle: false,
      batchSize: 64,
      validationSplit: 0.3,
      callbacks: {
        onTrainBegin: () =>
          console.info(
            `A training based on ${samples.xs.length} templates has been launched.`
          ),
        onTrainEnd: () => console.info("Neural network training completed.")
      }
    });
  } catch ({ message }) {
    throw new Error(`Failed to train the neural network: ${message}`);
  }
};

export default { run };
