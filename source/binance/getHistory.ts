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
  full: boolean = false
): Promise<ICandle[]> => {
  let candles: number[][] = [];

  for (
    let time = moment(),
      lowerBound = full
        ? moment().subtract(5, "year")
        : subtract(time, interval);
    time.isSameOrAfter(lowerBound) && time.isSameOrAfter("2000-01-01");
    time = subtract(time, interval)
  ) {
    const result = await axios.get(`https://api.binance.com/api/v3/klines`, {
      params: {
        symbol,
        interval,
        limit: 1000,
        startTime: subtract(time, interval).isSameOrAfter("2000-01-01")
          ? subtract(time, interval).valueOf()
          : moment()
              .subtract(5, "year")
              .valueOf(),
        endTime: time.valueOf()
      } as IParams
    });

    candles.push(...(result.data as number[][]));
  }

  // delete current candle
  candles.pop();

  return candles.reverse().map(
    (candle: number[]): ICandle => ({
      openTime: candle[0],
      open: candle[1],
      high: candle[2],
      low: candle[3],
      close: candle[4],
      volume: candle[5],
      closeTime: candle[6],
      quoteAssetVolume: candle[7],
      trades: candle[8],
      takeBaseAssetVolume: candle[9],
      takeQuoteAssetVolume: candle[10]
    })
  );
};
