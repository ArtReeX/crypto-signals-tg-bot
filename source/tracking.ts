import * as tf from "@tensorflow/tfjs-node";
import binance from "./binance";
import bot from "./bot";
import brain from "./brain";
import { ICandle } from "./brain/types";
import { IDirections, Symbol } from "./config";

const decisions = [
  "уверенная продажа",
  "неуверенная продажа",
  "нейтрально",
  "неуверенная покупка",
  "уверенная покупка"
];

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

        const [
          confirmedSale,
          unconfirmedSale,
          neutral,
          unconfirmedPurshapse,
          confirmedPurshapse
        ] = brain
          .predict(model, candles, sequence)
          .map(percent => (percent * 100).toFixed(2));

        bot.sendMessage(
          `Направление ${symbol} и интервал ${interval}, возможные развития:
          - точно вверх: \t ${confirmedPurshapse} %
          - неточно вверх: \t ${unconfirmedPurshapse} %
          - нейтрально: \t ${neutral} %
          - неточно вниз: \t ${unconfirmedSale} %
          - точно вниз: \t ${confirmedSale} %`
        );
      } catch ({ message }) {
        console.error(
          `Failed to get direction information ${symbol} with interval ${interval}: ${message}.`
        );
      }
    }
  }
};
