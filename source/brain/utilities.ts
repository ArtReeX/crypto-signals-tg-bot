import { ICandle } from "../binance/getHistory";

export const toArray = (candle: ICandle): number[] => [
  candle.open,
  candle.close,
  candle.high,
  candle.low
];
