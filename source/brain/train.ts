import * as tf from "@tensorflow/tfjs-node";
import { ISamples } from "./types";
import norm from "./normalization";

const run = async (
  model: tf.Sequential,
  samples: ISamples,
  epochs: number
): Promise<tf.History> => {
  try {
    console.info(
      `A training based on ${samples.xs.length} templates has been launched.`
    );

    const trainQuantity = (samples.xs.length / 100) * 95;

    const xsTrain = tf.tensor3d(samples.xs.slice(0, trainQuantity));
    const ysTrain = tf.tensor3d(samples.ys.slice(0, trainQuantity));

    const xsEvaluate = tf.tensor3d(
      samples.xs.slice(trainQuantity, samples.xs.length)
    );
    const ysEvaluate = tf.tensor3d(
      samples.ys.slice(trainQuantity, samples.ys.length)
    );

    const scale = [tf.tensor(0), tf.tensor(50000)] as [tf.Tensor, tf.Tensor];

    const result = await model.fit(
      norm.normalize(xsTrain, scale),
      norm.normalize(ysTrain, scale),
      {
        epochs,
        shuffle: false,
        batchSize: 1024,
        validationSplit: 0.2,
        callbacks: tf.callbacks.earlyStopping({
          patience: 2,
          verbose: 1
        })
      }
    );

    const [evaluateLoss, evaluateAccuracy] = model.evaluate(
      norm.normalize(xsEvaluate, scale),
      norm.normalize(ysEvaluate, scale)
    ) as tf.Scalar[];

    console.log(
      `Neural network training completed.
      - evaluate loss: ${evaluateLoss.dataSync().toString()},
      - evaluate accuracy: ${evaluateAccuracy.dataSync().toString()}`
    );

    return result;
  } catch ({ message }) {
    throw new Error(`Failed to train the neural network: ${message}`);
  }
};

export default { run };
