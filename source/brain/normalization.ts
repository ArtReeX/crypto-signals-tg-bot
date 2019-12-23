import * as tf from "@tensorflow/tfjs-node";

const scale = (tensor: tf.Tensor): [tf.Scalar, tf.Scalar] => [
  tensor.min(),
  tensor.max()
];

const normalize = (
  tensor: tf.Tensor,
  scale: [tf.Scalar, tf.Scalar] = [tf.scalar(0), tf.scalar(50000)]
): tf.Tensor => {
  const [min, max] = scale;
  return tensor.sub(min).div(max.sub(min));
};

const denormalize = (
  tensor: tf.Tensor,
  scale: [tf.Scalar, tf.Scalar] = [tf.scalar(0), tf.scalar(50000)]
): tf.Tensor => {
  const [min, max] = scale;
  return tensor.mul(max.sub(min)).add(min);
};

export default {
  scale,
  normalize,
  denormalize
};
