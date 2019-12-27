import * as tf from "@tensorflow/tfjs-node";
import { transpose } from "./utilities";

export const scale = (tensor: tf.Tensor): [tf.Scalar, tf.Scalar] => [
  tensor.min(),
  tensor.max()
];

export const normalize = (
  tensor: tf.Tensor,
  scale: [tf.Scalar, tf.Scalar] = [tf.scalar(0), tf.scalar(50000)]
): tf.Tensor => {
  const [min, max] = scale;
  return tensor.sub(min).div(max.sub(min));
};

export const denormalize = (
  tensor: tf.Tensor,
  scale: [tf.Scalar, tf.Scalar] = [tf.scalar(0), tf.scalar(50000)]
): tf.Tensor => {
  const [min, max] = scale;
  return tensor.mul(max.sub(min)).add(min);
};

export const smooth = (matrix: number[][], window: number = 3): number[][] => {
  const transposed = transpose(matrix);
  const smoothed = transposed.slice();

  for (let layer = 0; layer < transposed.length; layer++) {
    for (let step = window; step < transposed[layer].length; step++) {
      const sum = transposed[layer]
        .slice(step - window, step)
        .reduce((sum, current) => sum + current, 0);

      smoothed[layer][step] = sum / window;
    }
  }

  return transpose(smoothed);
};
