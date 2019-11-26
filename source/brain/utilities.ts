import { ICandle } from "./types";

export const toArray = (candle: ICandle): number[] =>
  Object.values(candle).map((value: string | number) => Number(value));

export const toObject = (array: number[]): ICandle => ({
  open: array[0],
  high: array[1],
  low: array[2],
  close: array[3],
  volume: array[4],
  quoteVolume: array[5],
  trades: array[6],
  baseAssetVolume: array[7],
  quoteAssetVolume: array[8]
});

export default { toArray, toObject };
