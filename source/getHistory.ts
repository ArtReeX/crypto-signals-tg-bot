import { ICandle } from "./binance/getHistory";
import binance from "./binance";
import { Interval } from "./config";

export default async (
  symbol: string,
  interval: Interval,
  timeout: number = 10
): Promise<ICandle[]> =>
  new Promise((resolve, reject) =>
    setTimeout(() => {
      binance
        .getHistory(symbol, interval)
        .then(candles => {
          return resolve(candles);
        })
        .catch((error: Error) => {
          return reject(error.message);
        });
    }, timeout * 1000)
  );
