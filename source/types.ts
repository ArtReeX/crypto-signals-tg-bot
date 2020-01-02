export interface ICandle {
  open: number;
  high: number;
  low: number;
  close: number;
}

export enum Trend {
  BULLISH = 1,
  NEUTRAL = 0,
  BEARISH = -1
}
