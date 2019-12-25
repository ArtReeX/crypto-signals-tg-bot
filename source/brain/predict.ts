import * as tf from "@tensorflow/tfjs-node";
import { ICandle } from "../binance/getHistory";
import { toArray } from "./utilities";
import { denormalize, normalize, smooth } from "./normalization";

export default (
  model: tf.LayersModel,
  candles: ICandle[],
  sequence: number
): number[] => {
  const array = candles.map(c => toArray(c));
  const seq = array.slice(candles.length - sequence, candles.length);
  const tensor = tf.tensor3d([seq]);

  const result = model.predict(tensor) as tf.Tensor2D;
  const [pick] = result.arraySync() as number[][];

  return pick;
};
