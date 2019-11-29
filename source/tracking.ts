import * as tf from "@tensorflow/tfjs-node";
import binance from "./binance";
import bot from "./bot";
import brain from "./brain";
import { ICandle } from "./brain/types";
import { IDirections, Symbol } from "./config";

const latestPrices: { [key: string]: number } = {};

export default async (
  model: tf.LayersModel,
  directions: IDirections,
  sequence: number
) => {
  for (let symbol in directions) {
    for (let interval of directions[symbol].intervals) {
      try {
        const candles: ICandle[] = await binance.getHistory(
          symbol as Symbol,
          interval
        );

        const result = brain.predict(model, candles, sequence);

        if (latestPrices[symbol + interval] !== result[0].close) {
          latestPrices[symbol + interval] = result[0].close;
        } else {
          continue;
        }

        bot.sendMessage(
          `Направление ${symbol} и интервал ${interval}, цена будет примерно ${result[0].close}.`
        );
      } catch ({ message }) {
        console.error(
          `Failed to get direction information ${symbol} with interval ${interval}: ${message}.`
        );
      }
    }
  }
};
