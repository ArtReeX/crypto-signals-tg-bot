import { ICandle, ISamples } from "./types";
import { toArray } from "./utilities";

const decision = (
  first: ICandle[],
  last: ICandle[]
): [number, number, number, number, number] => {
  const percents: number =
    (first[first.length - 1].close - last[last.length - 1].close) /
    last[last.length - 1].close;

  if (Math.abs(percents) >= 0.05) {
    return percents > 0 ? [0, 0, 0, 0, 1] : [1, 0, 0, 0, 0];
  } else if (Math.abs(percents) >= 0.01) {
    return percents > 0 ? [0, 0, 0, 1, 0] : [0, 1, 0, 0, 0];
  }

  return [0, 0, 0, 0, 0];
};

const create = (candles: ICandle[], sequence: number): ISamples => {
  const samples: ISamples = { x: [], y: [] };
  const candlesArray = candles.map((candle: ICandle) => toArray(candle));

  for (let count = 0; count + sequence < candles.length; count++) {
    samples.x.push(candlesArray.slice(count, count + sequence - 1));
    samples.y.push(
      decision(
        candles.slice(count, count + sequence - 1),
        candles.slice(count + sequence - 1, count + sequence)
      )
    );
  }

  return samples;
};

export default { create };
