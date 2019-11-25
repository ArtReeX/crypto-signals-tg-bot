import { Symbol, Interval } from "../getConfig";
import axios from "axios";

interface ICandle {
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

export default async (
  symbol: Symbol,
  interval: Interval,
  limit: number = 1000
): Promise<ICandle[]> => {
  const { data }: { data: number[][] } = await axios.get(
    "https://api.binance.com/api/v3/klines",
    {
      params: {
        symbol,
        interval,
        limit
      }
    }
  );

  return data.map(
    (candle: number[]): ICandle => ({
      open: candle[1],
      high: candle[2],
      low: candle[3],
      close: candle[4],
      volume: candle[5],
      quoteVolume: candle[7],
      trades: candle[8],
      baseAssetVolume: candle[9],
      quoteAssetVolume: candle[10]
    })
  );
};
