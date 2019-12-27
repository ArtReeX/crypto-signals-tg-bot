import * as tf from "@tensorflow/tfjs-node";
import binance from "./binance";
import bot from "./bot";
import brain from "./brain";
import { IDirections } from "./config";

const lastPrices: { [key: string]: number } = {};

export default async (
  model: tf.LayersModel,
  directions: IDirections,
  sequence: number
) => {
  for (let symbol in directions) {
    for (let interval of directions[symbol]) {
      try {
        const candles = await binance.getHistory(symbol, interval);
        const seq = candles.slice(candles.length - sequence, candles.length);

        const result = brain.predict(model, seq);

        if (lastPrices[symbol + interval] !== result[1]) {
          bot.sendMessage(`[${symbol}/${interval}] - ${result[0]}.`);

          lastPrices[symbol + interval] = result[1];
        }
      } catch ({ message }) {
        console.error(
          `Failed to get direction information ${symbol} with interval ${interval}: ${message}.`
        );
      }
    }
  }
};
