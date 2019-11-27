import { Symbol, Interval } from "../getConfig";
import axios from "axios";
import moment from "moment";

const URL = "https://api.binance.com/api/v3";

interface ICandle {
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

interface IParams {
  symbol: Symbol;
  interval: Interval;
  startTime?: number;
  endTime?: number;
  limit?: number;
}

const subtract = (time: moment.Moment, interval: Interval): moment.Moment => {
  const unit: number = Number(interval.replace(/\D/, "")) * 1000;

  if (interval.includes("m")) {
    return moment(time).subtract(unit, "minute");
  }
  if (interval.includes("h")) {
    return moment(time).subtract(unit, "hour");
  }
  if (interval.includes("d")) {
    return moment(time).subtract(unit, "day");
  }
  if (interval.includes("w")) {
    return moment(time).subtract(unit, "week");
  }
  if (interval.includes("M")) {
    return moment(time).subtract(unit, "month");
  }

  return moment(time);
};

export default async (
  symbol: Symbol,
  interval: Interval,
  allTime: boolean = false
): Promise<ICandle[]> => {
  let candles: number[][] = [];

  for (
    let time = moment(),
      lowerBound = allTime
        ? moment().subtract(2, "year")
        : subtract(time, interval);
    time.isSameOrAfter(lowerBound) && time.isSameOrAfter("2000-01-01");
    time = subtract(time, interval)
  ) {
    const result = await axios.get(`${URL}/klines`, {
      params: {
        symbol,
        interval,
        limit: 1000,
        startTime: subtract(time, interval).valueOf(),
        endTime: time.valueOf()
      } as IParams
    });

    candles.push(...(result.data as number[][]));
  }

  return candles.reverse().map(
    (candle: number[]): ICandle => ({
      open: candle[1],
      high: candle[2],
      low: candle[3],
      close: candle[4],
      volume: candle[5],
      trades: candle[6],
      quoteVolume: candle[7],
      baseAssetVolume: candle[9],
      quoteAssetVolume: candle[10]
    })
  );
};
