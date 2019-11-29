export interface ICandle {
  openTime: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  closeTime: number;
  quoteAssetVolume: number;
  trades: number;
  takeBaseAssetVolume: number;
  takeQuoteAssetVolume: number;
}

export interface ISamples {
  xs: number[][][];
  ys: number[][][];
}
