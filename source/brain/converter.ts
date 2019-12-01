import { ICandle } from "./types";

const toArray = (candle: ICandle): number[] => [
  candle.open,
  candle.high,
  candle.low,
  candle.close,
  candle.volume
];

const toObject = (candle: number[]): Pick<ICandle, "close"> => ({
  close: candle[3]
});

export default { toArray, toObject };
