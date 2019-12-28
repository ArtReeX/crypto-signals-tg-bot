import binance from "./binance";
import bot from "./bot";
import { IDirections } from "./config";
import * as ti from "technicalindicators";

const last: { [key: string]: { bullish: boolean; bearish: boolean } } = {};

export default async (directions: IDirections) => {
  for (let symbol in directions) {
    for (let interval of directions[symbol]) {
      try {
        const candles = await binance.getHistory(symbol, interval);
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
};
