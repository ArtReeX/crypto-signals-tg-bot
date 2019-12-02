import { ICandle, ISamples } from "./types";
import conv from "./converter";

const create = (
  candles: ICandle[],
  seqPast: number,
  seqFuture: number
): ISamples => {
  const samples: ISamples = { xs: [], ys: [] };
  const simplified = candles.map((candle: ICandle) => conv.toArray(candle));

  for (let count = 0; count + seqPast + seqFuture < candles.length; count++) {
    samples.xs.push(simplified.slice(count, count + seqPast));
    samples.ys.push(
      simplified.slice(count + seqPast, count + seqPast + seqFuture)
    );
  }

  return samples;
};

export default { create };
