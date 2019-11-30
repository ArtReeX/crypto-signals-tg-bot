import binance from "./binance";
import brain from "./brain";
import { ICandle, ISamples } from "./brain/types";
import getConfig, { Interval } from "./config";
import tracking from "./tracking";

const {
  tensorflow: { seqPast, seqFuture, epochs },
  directions
} = getConfig();

const trainingIntervals: Interval[] = ["1h"];

(async () => {
  if (!brain.images.exist()) {
    const model = brain.create(seqPast, seqFuture, 4);

    for (const i of trainingIntervals) {
      const history: ICandle[] = await binance.getHistory("BTCUSDT", i, true);
      const samples: ISamples = brain.samples.create(
        history,
        seqPast,
        seqFuture
      );

      await brain.train.run(model, samples, epochs);
    }

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

    tracking(model, directions, seqPast);
    setInterval(async () => {
      tracking(model, directions, seqPast);
    }, 60 * 1000);

    console.info("Neural bot launched successfully.");
  } catch ({ message }) {
    throw new Error(`Failed to load neural network image: ${message}`);
  }
})();
