import binance from "./binance";
import Core from "./core/Core";
import { ISamples } from "./core/types";
import { ICandle } from "./types";
import limiter from "./limiter";
import _ from "lodash";
import config, { Interval, IIntervals } from "./config";
import { ema, differenceInPercent } from "./utilities";
import bot from "./bot";
import Tracker from "./Tracker";

(async () => {
  const { symbols, intervals } = config();
  const tracker = new Tracker();

  for (; true; ) {
    const requests: { [key: string]: Promise<ICandle[]> } = {};
    for (const symbol of symbols) {
      for (const interval in intervals) {
        requests[`${symbol}/${interval}`] = binance.getHistory(
          symbol,
          interval as Interval
        );
      }
    }

    const executed = await limiter.execute(requests);

    for (const direction in executed) {
      const closes: number[] = executed[direction].map((c: ICandle) => c.close);
      const indicators = ema(closes, 5);
      const difference = differenceInPercent(
        closes[closes.length - 1],
        indicators[indicators.length - 2]
      );

      if (
        Math.abs(difference) > intervals[direction.split("/")[1] as Interval] &&
        tracker.isAllowed(direction)
      ) {
        bot.sendMessage(`${direction} - резкое изменение на ${difference}%.`);
        tracker.add(direction);
      }
    }

    await limiter.sleep(10);
  }
})();
