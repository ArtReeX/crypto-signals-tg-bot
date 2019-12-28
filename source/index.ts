import binance from "./binance";
import { ICandle } from "./binance/getHistory";
import getConfig, { Interval } from "./config";
import tracking from "./tracking";

const { directions } = getConfig();

(async () => {
  try {
    tracking(directions);
    setInterval(async () => {
      tracking(directions);
    }, 60 * 1000);

    console.info("Neural bot launched successfully.");
  } catch ({ message }) {
    throw new Error(`Failed to load neural network image: ${message}`);
  }
})();
