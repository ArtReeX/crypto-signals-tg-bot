import * as tf from "@tensorflow/tfjs-node";
import binance from "./binance";
import bot from "./bot";
import brain from "./brain";
import { Decision, ICandle } from "./brain/types";
import { IDirections, Symbol } from "./getConfig";

const lastDecisions: { [key: string]: Decision } = {};

export default async (model: tf.LayersModel, directions: IDirections) => {
  for (let symbol in directions) {
    for (let interval of directions[symbol].intervals) {
      try {
        const candles: ICandle[] = await binance.getHistory(
          symbol as Symbol,
          interval
        );

        const decision = brain.predict(model, candles);

        if (decision !== lastDecisions[symbol]) {
          lastDecisions[symbol] = decision;
        } else {
          continue;
        }

        switch (decision) {
          case Decision.ConfidentSale: {
            bot.sendMessage(
              `The direction ${symbol} with the interval ${interval} is a sure sale.`
            );
            break;
          }
          case Decision.InsecureSale: {
            bot.sendMessage(
              `The direction ${symbol} with the interval ${interval} is an uncertain sale.`
            );
            break;
          }
          case Decision.ConfidentPurchase: {
            bot.sendMessage(
              `The direction ${symbol} with the interval ${interval} is a sure buy.`
            );
            break;
          }
          case Decision.InsecurePurchase: {
            bot.sendMessage(
              `The direction ${symbol} with the interval ${interval} is an uncertain purchase.`
            );
            break;
          }
          default: {
            bot.sendMessage(
              `The direction ${symbol} with the interval ${interval} is neutral.`
            );
            break;
          }
        }
      } catch ({ message }) {
        console.error(
          `Failed to get direction information ${symbol} with interval ${interval}: ${message}.`
        );
      }
    }
  }
};
