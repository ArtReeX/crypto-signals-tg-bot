import * as tf from "@tensorflow/tfjs-node";
import { ICandle } from "./types";
import { toArray } from "./utilities";
import norm from "./normalization";

export default (
  model: tf.LayersModel,
  candles: ICandle[],
  sequence: number
): number[] => {
  const array = candles
    .map(candle => toArray(candle))
    .slice(candles.length - sequence + 1, candles.length);

  const scale = norm.scale2d(array);

  const [result]: number[][] = (model.predict(
    tf
      .tensor2d(norm.normalize2d(array, scale))
      .as3D(1, array.length, array[0].length)
  ) as tf.Tensor<tf.Rank>).arraySync() as number[][];

  return result;
};
