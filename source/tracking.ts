import * as tf from "@tensorflow/tfjs-node";
import binance from "./binance";
import bot from "./bot";
import brain from "./brain";
import { IDirections } from "./config";

export default async (
  model: tf.LayersModel,
  directions: IDirections,
  sequence: number
) => {
  for (let symbol in directions) {
    for (let interval of directions[symbol].intervals) {
      try {
        const candles = await binance.getHistory(symbol, interval);
        const result = brain.predict(model, candles, sequence);

        console.log(result);
      } catch ({ message }) {
        console.error(
          `Failed to get direction information ${symbol} with interval ${interval}: ${message}.`
        );
      }
    }
  }
};
