import * as tf from "@tensorflow/tfjs-node";
import { ICandle } from "../binance/getHistory";
import { toArray } from "./utilities";
import { denormalize, normalize, smooth } from "./normalization";

export default (model: tf.LayersModel, candles: ICandle[]): number[] => {
  const array = candles.map(c => toArray(c));
  const tensor = tf.tensor3d([array]);

  const result = model.predict(tensor) as tf.Tensor2D;
  const [pick] = result.arraySync() as number[][];

  return pick;
};
