import { ICandle } from "../binance/getHistory";
import { toArray } from "./utilities";

export interface ISamples {
  xs: number[][][];
  ys: number[][];
}

const create = (candles: ICandle[], sequence: number): ISamples => {
  const samples: ISamples = { xs: [], ys: [] };

  for (let count = 0; count + sequence + 1 < candles.length; count++) {
    const seq = candles.slice(count, count + sequence).map(c => toArray(c));
    const target = toArray(candles[count + sequence + 1]);

    samples.xs.push(seq);
    samples.ys.push(target);
  }

  return samples;
};

export default { create };
