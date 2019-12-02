import * as tf from "@tensorflow/tfjs-node";

const scale = (tensor: tf.Tensor): [tf.Tensor, tf.Tensor] => [
  tensor.min(),
  tensor.max()
];

const normalize = (
  tensor: tf.Tensor,
  scale: [tf.Tensor, tf.Tensor]
): tf.Tensor => tensor.sub(scale[0]).div(scale[1].sub(scale[0]));

const denormalize = (
  tensor: tf.Tensor,
  scale: [tf.Tensor, tf.Tensor]
): tf.Tensor => tensor.mul(scale[1].sub(scale[0])).add(scale[0]);

export default { scale, normalize, denormalize };
