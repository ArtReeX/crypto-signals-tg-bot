import * as tf from "@tensorflow/tfjs-node";
import { ICandle } from "./types";
import conv from "./converter";
import norm from "./normalization";

export default (
  model: tf.LayersModel,
  candles: ICandle[],
  seqPast: number
): Pick<ICandle, "close">[] => {
  const array = candles
    .map(candle => conv.toArray(candle))
    .slice(candles.length - seqPast, candles.length);

  const scale = norm.scale2d(array);

  const [result] = (model.predict(
    tf
      .tensor2d(norm.normalize2d(array, scale))
      .as3D(1, array.length, array[0].length)
  ) as tf.Tensor<tf.Rank>).arraySync() as number[][][];

  return norm.denormalize2d(result, scale).map(candle => conv.toObject(candle));
};
