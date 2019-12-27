import binance from "./binance";
import brain from "./brain";
import { ISamples } from "./brain/samples";
import { ICandle } from "./binance/getHistory";
import getConfig, { Interval } from "./config";
import tracking from "./tracking";

const SEQUENCE = 10;

const { directions } = getConfig();

const params: { [key: string]: Interval[] } = {
  BTCUSDT: ["2h", "4h", "6h", "12h"]
};

(async () => {
  if (!brain.images.exist()) {
    const samples: ISamples = { xs: [], ys: [] };
    for (const direction in params) {
      for (const interval of params[direction]) {
        const history: ICandle[] = await binance.getHistory(
          direction,
          interval,
          true
        );
        const partialSamples: ISamples = brain.samples.create(
          history,
          SEQUENCE
        );

        samples.xs.push(...partialSamples.xs);
        samples.ys.push(...partialSamples.ys);
      }
    }

    const model = brain.create(SEQUENCE, samples.xs[0][0].length);
    await brain.train.run(model, samples);

    try {
      await model.save("file://./model");
      console.info("Neural network snapshot saved successfully.");
    } catch ({ message }) {
      throw new Error(`Failed to save snapshot of neural network: ${message}`);
    }
  }

  try {
    const model = await brain.images.load();
    console.info("Neural network snapshot loaded successfully.");

    tracking(model, directions, SEQUENCE);
    setInterval(async () => {
      tracking(model, directions, SEQUENCE);
    }, 60 * 1000);

    console.info("Neural bot launched successfully.");
  } catch ({ message }) {
    throw new Error(`Failed to load neural network image: ${message}`);
  }
})();
