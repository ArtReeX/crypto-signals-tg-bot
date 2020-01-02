import Binance, {
  CandleChartInterval,
  CandleChartResult
} from "binance-api-node";
import moment from "moment";
import { Interval } from "../config";
import { ICandle } from "../types";
import { intervalInMinutes } from "../utilities";

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
