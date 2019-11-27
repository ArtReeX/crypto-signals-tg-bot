import * as tf from "@tensorflow/tfjs-node";
import { ICandle } from "./types";
import { toArray } from "./utilities";

export default (
  model: tf.LayersModel,
  candles: ICandle[],
  sequence: number
): number[] => {
  const candlesPart: number[][] = candles
    .map(candle => toArray(candle))
    .slice(candles.length - sequence + 1, candles.length);

  const [result]: number[][] = (model.predict(
    tf.constraints
      .minMaxNorm({ minValue: 0, maxValue: 1 })
      .apply(tf.tensor2d(candlesPart))
      .as3D(1, candlesPart.length, candlesPart[0].length)
  ) as tf.Tensor<tf.Rank>).arraySync() as number[][];
  console.log(result.toString());
  return result;
};
