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
        units: 256,
        returnSequences: true
      }),

      tf.layers.lstm({
        units: 128,
        returnSequences: true
      }),

      tf.layers.lstm({
        units: 64,
        returnSequences: true
      }),

      tf.layers.lstm({
        units: 32,
        activation: "softmax"
      }),

      tf.layers.dense({
        units: seqFuture * candleSize
      }),

      tf.layers.reshape({ targetShape: [seqFuture, candleSize] })
    ]
  });

  model.summary();

  model.compile({
    optimizer: tf.train.rmsprop(0.3),
    loss: tf.metrics.meanAbsoluteError,
    metrics: tf.metrics.meanAbsoluteError
  });

  return model;
};