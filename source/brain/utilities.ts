import { ICandle } from "../binance/getHistory";

export const toArray = (candle: ICandle): number[] => [
  candle.open,
  candle.close,
  candle.high,
  candle.low
];

export const transpose = (matrix: number[][]): number[][] =>
  Object.keys(matrix[0]).map((_, i) => matrix.map(r => r[i]));
