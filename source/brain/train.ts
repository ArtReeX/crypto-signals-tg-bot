import * as tf from "@tensorflow/tfjs-node";
import { ISamples } from "./samples";
import { normalize } from "./normalization";

const run = async (
  model: tf.Sequential,
  samples: ISamples
): Promise<tf.History> => {
  try {
    console.info(
      `A training based on ${samples.xs.length} templates has been launched.`
    );

    const trainQuantity = (samples.xs.length / 100) * 90;

    const xsTrain = tf.tensor3d(samples.xs.slice(0, trainQuantity));
    const ysTrain = tf.tensor2d(samples.ys.slice(0, trainQuantity));

    const xsEvaluate = tf.tensor3d(samples.xs.slice(trainQuantity));
    const ysEvaluate = tf.tensor2d(samples.ys.slice(trainQuantity));

    const result = await model.fit(xsTrain, ysTrain, {
      epochs: 500,
      shuffle: false,
      batchSize: 1024,
      validationSplit: 0.2,
      callbacks: tf.callbacks.earlyStopping({
        patience: 2,
        verbose: 1
      })
    });

    const [evaluateLoss, evaluateAccuracy] = model.evaluate(
      xsEvaluate,
      ysEvaluate
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
