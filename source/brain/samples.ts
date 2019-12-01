import { ICandle, ISamples } from "./types";
import conv from "./converter";
import norm from "./normalization";
import * as tf from "@tensorflow/tfjs-node";

const create = (
  candles: ICandle[],
  seqPast: number,
  seqFuture: number
): ISamples => {
  const samples: ISamples = { xs: [], ys: [] };
  const candlesArray = candles.map((candle: ICandle) => conv.toArray(candle));

  for (let count = 0; count + seqPast + seqFuture < candles.length; count++) {
    const scale = norm.scale2d(candlesArray.slice(count, count + seqPast + 1));

    samples.xs.push(
      norm.normalize2d(candlesArray.slice(count, count + seqPast), scale)
    );
    samples.ys.push(
      norm.normalize2d(
        candlesArray.slice(count + seqPast, count + seqPast + seqFuture),
        scale
      )
    );
  }

  return samples;
};

export default { create };
