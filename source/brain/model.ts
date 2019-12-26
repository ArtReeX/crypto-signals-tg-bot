import * as tf from "@tensorflow/tfjs-node";

export default (sequence: number, params: number): tf.Sequential => {
  const model = tf.sequential({
    layers: [
      tf.layers.lstm({
        inputShape: [sequence, params],
        units: 32,
        activation: "relu",
        returnSequences: true
      }),

      tf.layers.lstm({
        units: 32,
        activation: "relu",
        returnSequences: true
      }),

      tf.layers.lstm({
        units: 32,
        activation: "relu"
      }),

      tf.layers.dense({
        units: params,
        activation: "linear"
      })
    ]
  });

  model.summary();

  model.compile({
    optimizer: tf.train.adam(),
    loss: tf.metrics.meanAbsolutePercentageError,
    metrics: tf.metrics.meanAbsolutePercentageError
  });

  return model;
};
