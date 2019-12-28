import binance from "./binance";
import { ICandle } from "./binance/getHistory";
import getConfig, { Interval } from "./config";
import * as ti from "technicalindicators";
import bot from "./bot";
import getHistory from "./getHistory";

const { symbols, intervals } = getConfig();
const last: { [key: string]: { bullish: boolean; bearish: boolean } } = {};

(async () => {
  try {
    for (; true; ) {
      for (let symbol of symbols) {
        for (let interval of intervals) {
          try {
            const candles = await getHistory(symbol, interval, 5);
            const seq = candles.slice(candles.length - 10, candles.length);

            const open = seq.map(c => c.open);
            const close = seq.map(c => c.close);
            const high = seq.map(c => c.high);
            const low = seq.map(c => c.low);

            const bullish = ti.bullish({ open, close, high, low });
            const bearish = ti.bearish({ open, close, high, low });

            if (last[symbol + interval] === undefined) {
              last[symbol + interval] = { bullish, bearish };
            } else if (
              last[symbol + interval].bullish !== bullish ||
              last[symbol + interval].bearish !== bearish
            ) {
              last[symbol + interval] = { bullish, bearish };

              bot.sendMessage(
                `[${symbol}/${interval}] - ${
                  bullish ? "бычий" : bearish ? "медвежий" : "нейтральный"
                } тренд.`
              );
            }
          } catch ({ message }) {
            console.error(
              `Failed to get direction information ${symbol} with interval ${interval}: ${message}.`
            );
          }
        }
      }
    }

    console.info("Neural bot launched successfully.");
  } catch ({ message }) {
    throw new Error(`Failed to load neural network image: ${message}`);
  }
})();
