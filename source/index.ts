import binance from "./binance";
import brain from "./brain";
import { ICandle, ISamples } from "./brain/types";
import getConfig, { Symbol } from "./getConfig";
import tracking from "./tracking";

const {
  tensorflow: { sequence },
  directions
} = getConfig();

(async () => {
  if (!brain.images.exist()) {
    const history: ICandle[] = await binance.getHistory("BTCUSDT", "2h", true);
    const samples: ISamples = brain.samples.create(history, sequence);

    await brain.train.run(samples);
  }

  try {
    const model = await brain.images.load();
    console.info("Neural network snapshot loaded successfully.");

    tracking(model, directions);
    setInterval(async () => {
      tracking(model, directions);
    }, 60 * 1000);
  } catch ({ message }) {
    throw new Error(`Failed to load neural network image: ${message}`);
  }
})();
