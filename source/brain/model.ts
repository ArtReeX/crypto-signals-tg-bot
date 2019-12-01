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
        units: 32,

        returnSequences: true,

        recurrentRegularizer: tf.regularizers.l2(),
        biasRegularizer: tf.regularizers.l2(),
        kernelRegularizer: tf.regularizers.l2()
      }),

      tf.layers.lstm({
        units: 16,

        activation: "selu",

        recurrentRegularizer: tf.regularizers.l2(),
        biasRegularizer: tf.regularizers.l2(),
        kernelRegularizer: tf.regularizers.l2()
      }),

      tf.layers.dense({
        units: seqFuture * candleSize
      }),

      tf.layers.reshape({ targetShape: [seqFuture, candleSize] })
    ]
  });

  model.summary();

  model.compile({
    optimizer: tf.train.rmsprop(0.001),
    loss: tf.metrics.meanAbsoluteError,
    metrics: tf.metrics.meanAbsoluteError
  });

  return model;
};
