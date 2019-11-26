import { Interval, Symbol } from "./getConfig";
import { ICandle, Decision } from "./brain/types";
import binance from "./binance";
import brain from "./brain";
import * as tf from "@tensorflow/tfjs-node";

export default async (
  model: tf.LayersModel,
  symbol: Symbol,
  interval: Interval
) => {
  const candles: ICandle[] = await binance.getHistory(symbol, interval);

  const decision = brain.predict(model, candles);

  switch (decision) {
    case Decision.ConfidentSale: {
      console.info(
        `The direction ${symbol} with the interval ${interval} is a sure sale.`
      );
      break;
    }
    case Decision.InsecureSale: {
      console.info(
        `The direction ${symbol} with the interval ${interval} is an uncertain sale.`
      );
      break;
    }
    case Decision.ConfidentPurchase: {
      console.info(
        `The direction ${symbol} with the interval ${interval} is a sure buy.`
      );
      break;
    }
    case Decision.InsecurePurchase: {
      console.info(
        `The direction ${symbol} with the interval ${interval} is an uncertain purchase.`
      );
      break;
    }
    default: {
      console.info(
        `The direction ${symbol} with the interval ${interval} is neutral.`
      );
      break;
    }
  }
};
