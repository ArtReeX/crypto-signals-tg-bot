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

const lastDecistions: { [key: string]: number } = {};

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

        const decision = brain.predict(model, candles, sequence);
        const decisionPosition = decision.indexOf(Math.max(...decision));

        if (lastDecistions[symbol + interval] !== decisionPosition) {
          lastDecistions[symbol + interval] = decisionPosition;
        } else {
          continue;
        }

        bot.sendMessage(
          `Направление ${symbol} и интервал ${interval}, решение нейронной сети:
          - ${decisions[decisionPosition]}`
        );
      } catch ({ message }) {
        console.error(
          `Failed to get direction information ${symbol} with interval ${interval}: ${message}.`
        );
      }
    }
  }
};
