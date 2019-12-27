import { ICandle } from "../binance/getHistory";
import { toArray, transpose } from "./utilities";
import { smooth } from "./normalization";

export interface ISamples {
  xs: number[][][];
  ys: number[][];
}

const create = (candles: ICandle[], sequence: number): ISamples => {
  const samples: ISamples = { xs: [], ys: [] };
  const array = candles.map(c => toArray(c));

  for (let count = 0; count + sequence + 1 < candles.length; count++) {
    const seq = array.slice(count, count + sequence);
    const target = array[count + sequence + 1];

    samples.xs.push(seq);
    samples.ys.push(target);
  }

  return samples;
};

export default { create };
