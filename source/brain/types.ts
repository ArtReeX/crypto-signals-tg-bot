export enum Decision {
  ConfidentPurchase = 2,
  InsecurePurchase = 1,
  Neutral = 0,
  InsecureSale = -1,
  ConfidentSale = -2
}

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
