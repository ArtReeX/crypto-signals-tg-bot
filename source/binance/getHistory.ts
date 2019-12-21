import { Symbol, Interval } from "../config";
import axios from "axios";
import moment from "moment";

interface ICandle {
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

interface IParams {
  symbol: Symbol;
  interval: Interval;
  startTime?: number;
  endTime?: number;
  limit?: number;
}

const intervalInMinutes = (interval: Interval): number => {
  switch (interval) {
    case "1m": {
      return 1;
    }
    case "3m": {
      return 3;
    }
    case "5m": {
      return 5;
    }
    case "15m": {
      return 15;
    }
    case "30m": {
      return 30;
    }
    case "1h": {
      return 60;
    }
    case "2h": {
      return 60 * 2;
    }
    case "4h": {
      return 60 * 4;
    }
    case "6h": {
      return 60 * 6;
    }
    case "12h": {
      return 60 * 12;
    }
    case "1d": {
      return 60 * 24;
    }
    case "3d": {
      return 60 * 24 * 3;
    }
    case "1w": {
      return 60 * 24 * 7;
    }
    case "1M": {
      return 60 * 24 * 7 * 30;
    }
  }
};

export default async (
  symbol: Symbol,
  interval: Interval,
  full: boolean = false
): Promise<ICandle[]> => {
  let candles: number[][] = [];

  for (
    let time = full
      ? moment().subtract(5, "years")
      : moment().subtract(intervalInMinutes(interval) * 1000, "minutes");
    time.isSameOrBefore(moment()) && time.isValid();
    time.add(intervalInMinutes(interval) * 1000, "minutes")
  ) {
    const result = await axios.get(`https://api.binance.com/api/v3/klines`, {
      params: {
        symbol,
        interval,
        limit: 1000,
        startTime: time.valueOf(),
        endTime: time
          .clone()
          .add(intervalInMinutes(interval) * 1000, "minutes")
          .valueOf()
      } as IParams
    });

    candles.push(...(result.data as number[][]));
  }

  // delete current candle
  candles.pop();

  return candles.map(
    (candle: number[]): ICandle => ({
      openTime: Number(candle[0]),
      open: Number(candle[1]),
      high: Number(candle[2]),
      low: Number(candle[3]),
      close: Number(candle[4]),
      volume: Number(candle[5]),
      closeTime: Number(candle[6]),
      quoteAssetVolume: Number(candle[7]),
      trades: Number(candle[8]),
      takeBaseAssetVolume: Number(candle[9]),
      takeQuoteAssetVolume: Number(candle[10])
    })
  );
};
