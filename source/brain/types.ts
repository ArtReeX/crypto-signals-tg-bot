export enum Decision {
  ConfidentPurchase = 4,
  InsecurePurchase = 3,
  Neutral = 2,
  InsecureSale = 1,
  ConfidentSale = 0
}

export interface ICandle {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  quoteVolume: number;
  trades: number;
  baseAssetVolume: number;
  quoteAssetVolume: number;
}

export interface ISamples {
  x: number[][][];
  y: number[][];
}
