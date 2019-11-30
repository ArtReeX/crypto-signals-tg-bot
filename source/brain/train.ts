import * as tf from "@tensorflow/tfjs-node";
import { ISamples } from "./types";

const run = async (
  model: tf.Sequential,
  samples: ISamples,
  epochs: number
): Promise<tf.History> => {
  try {
    const trainQuantity = (samples.xs.length / 100) * 80;

    const xsTrain = tf.tensor3d(samples.xs.slice(0, trainQuantity));
    const ysTrain = tf.tensor3d(samples.ys.slice(0, trainQuantity));

    const xsEvaluate = tf.tensor3d(
      samples.xs.slice(trainQuantity, samples.xs.length)
    );
    const ysEvaluate = tf.tensor3d(
      samples.ys.slice(trainQuantity, samples.ys.length)
    );

    return model.fit(xsTrain, ysTrain, {
      epochs,
      shuffle: false,
      batchSize: 128,
      validationSplit: 0.3,
      callbacks: {
        onTrainBegin: () =>
          console.info(
            `A training based on ${samples.xs.length} templates has been launched.`
          ),
        onTrainEnd: () => {
          const [evaluateLoss, evaluateAccuracy] = model.evaluate(
            xsEvaluate,
            ysEvaluate
          ) as tf.Scalar[];

          console.log(
            `Neural network training completed.
              - evaluate loss: ${evaluateLoss.dataSync().toString()},
              - evaluate accuracy: ${evaluateAccuracy.dataSync().toString()}`
          );
        }
      }
    });
  } catch ({ message }) {
    throw new Error(`Failed to train the neural network: ${message}`);
  }
};

export default { run };
