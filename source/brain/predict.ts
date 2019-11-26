import * as tf from "@tensorflow/tfjs-node";
import { ICandle, Decision } from "./types";
import { toArray, toObject } from "./utilities";
import getConfig from "../getConfig";
import Scaler from "./normalization";

export default (model: tf.LayersModel, candles: ICandle[]): Decision => {
  const candlesPart: number[][] = candles
    .map(candle => toArray(candle))
    .slice(
      candles.length - getConfig().tensorflow.sequence + 1,
      candles.length
    );

  const scaler = new Scaler(candlesPart);

  const [result]: number[][] = (model.predict(
    tf.tensor3d([scaler.normalize2d()])
  ) as tf.Tensor<tf.Rank>).arraySync() as number[][];

  if (
    result[0] > result[1] &&
    result[0] > result[2] &&
    result[0] > result[3] &&
    result[0] > result[4]
  ) {
    return Decision.ConfidentSale;
  } else if (
    result[1] > result[0] &&
    result[1] > result[2] &&
    result[1] > result[3] &&
    result[1] > result[4]
  ) {
    return Decision.InsecureSale;
  } else if (
    result[3] > result[0] &&
    result[3] > result[1] &&
    result[3] > result[2] &&
    result[3] > result[4]
  ) {
    return Decision.InsecurePurchase;
  } else if (
    result[4] > result[0] &&
    result[4] > result[1] &&
    result[4] > result[2] &&
    result[4] > result[3]
  ) {
    return Decision.ConfidentPurchase;
  }

  return Decision.Neutral;
};
