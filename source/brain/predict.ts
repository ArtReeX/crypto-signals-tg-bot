import * as tf from "@tensorflow/tfjs-node";
import { ICandle } from "./types";
import conv from "./converter";
import norm from "./normalization";

export default (
  model: tf.LayersModel,
  candles: ICandle[],
  seqPast: number
): Pick<ICandle, "close">[] => {
  const seq = tf.tensor3d([
    candles
      .map(candle => conv.toArray(candle))
      .slice(candles.length - seqPast, candles.length)
  ]);

  const scale = [tf.tensor(0), tf.tensor(50000)] as [tf.Tensor, tf.Tensor];

  const result = model.predict(norm.normalize(seq, scale)) as tf.Tensor<
    tf.Rank
  >;

  const [denormaziled] = norm
    .denormalize(result, scale)
    .arraySync() as number[][][];

  return denormaziled.map(candle => conv.toObject(candle));
};
