import * as tf from "@tensorflow/tfjs-node";

const scale = (tensor: tf.Tensor): [tf.Tensor, tf.Tensor] => [
  tensor.min(),
  tensor.max()
];

const normalize = (
  tensor: tf.Tensor,
  scale: [tf.Tensor, tf.Tensor]
): tf.Tensor => {
  const [min, max] = scale;
  return tensor.sub(min).div(max.sub(min));
};

const denormalize = (
  tensor: tf.Tensor,
  scale: [tf.Tensor, tf.Tensor]
): tf.Tensor => {
  const [min, max] = scale;
  return tensor.mul(max.sub(min)).add(min);
};

export default {
  scale,
  normalize,
  denormalize
};
