import * as tf from "@tensorflow/tfjs-node";

export default (
  seqPast: number,
  seqFuture: number,
  candleSize: number
): tf.Sequential => {
  const model = tf.sequential({
    layers: [
      tf.layers.lstm({
        inputShape: [seqPast, candleSize],
        units: 12,
        returnSequences: true,
        activation: "relu"
      }),

      tf.layers.lstm({
        units: 12,
        activation: "relu"
      }),

      tf.layers.dense({
        units: seqFuture * candleSize,
        activation: "linear"
      }),

      tf.layers.reshape({ targetShape: [seqFuture, candleSize] })
    ]
  });

  model.summary();

  model.compile({
    optimizer: tf.train.adam(0.001),
    loss: tf.metrics.meanAbsoluteError,
    metrics: tf.metrics.meanAbsoluteError
  });

  return model;
};
