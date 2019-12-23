import * as tf from "@tensorflow/tfjs-node";
import { ICandle } from "../binance/getHistory";
import norm from "./normalization";
import { toArray } from "./utilities";

export default (
  model: tf.LayersModel,
  candles: ICandle[],
  sequence: number
): number[] => {
  const seq = candles.slice(candles.length - sequence, candles.length);
  const normalized = norm.normalize(tf.tensor3d([seq.map(c => toArray(c))]));

  const result = model.predict(normalized) as tf.Tensor2D;
  const [pick] = norm.denormalize(result).arraySync() as number[][];

  return pick;
};
