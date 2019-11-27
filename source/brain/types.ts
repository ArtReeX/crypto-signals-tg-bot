export interface ICandle {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  trades: number;
  quoteVolume: number;
  baseAssetVolume: number;
  quoteAssetVolume: number;
}

export interface ISamples {
  x: number[][][];
  y: number[][];
}
