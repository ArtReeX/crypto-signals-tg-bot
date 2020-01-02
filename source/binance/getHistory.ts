import { Interval } from "../config";
import moment from "moment";
import Binance, {
  CandleChartInterval,
  CandleChartResult
} from "binance-api-node";
import { ICandle } from "../types";

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
  symbol: string,
  interval: Interval,
  full: boolean = false
): Promise<ICandle[]> => {
  const client = Binance();
  let candles: CandleChartResult[] = [];

  for (
    let max = moment(),
      time = full
        ? max.clone().subtract(5, "years")
        : max.clone().subtract(intervalInMinutes(interval) * 1000, "minutes");
    time.isBefore(max) && time.isValid();
    time.add(intervalInMinutes(interval) * 1000, "minutes")
  ) {
    const result = await client.candles({
      symbol,
      interval: interval as CandleChartInterval,
      limit: 1000,
      startTime: time.valueOf(),
      endTime: time
        .clone()
        .add(intervalInMinutes(interval) * 1000, "minutes")
        .valueOf()
    });

    candles.push(...result);
  }

  // delete current candle
  // candles.pop();

  return candles.map(c => ({
    open: Number(c.open),
    close: Number(c.close),
    high: Number(c.high),
    low: Number(c.low)
  }));
};
