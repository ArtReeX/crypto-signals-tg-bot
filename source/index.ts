import brain from "./brain";
import { ISamples } from "./brain/types";
import binance from "./binance";
import { ICandle } from "./brain/types";

(async () => {
  if (!brain.images.exist()) {
    const history: ICandle[] = await binance.getHistory("BTCUSDT", "2h", true);
    const samples: ISamples = brain.samples.create(history);

    await brain.train.run(samples);
  }

  try {
    const model = await brain.images.load();
    console.info("Neural network snapshot loaded successfully.");
  } catch ({ message }) {
    throw new Error(`Failed to load neural network image: ${message}`);
  }
})();
