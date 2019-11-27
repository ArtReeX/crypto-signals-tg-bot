import binance from "./binance";
import brain from "./brain";
import { ICandle, ISamples } from "./brain/types";
import getConfig, { Symbol } from "./getConfig";
import track from "./track";

(async () => {
  if (!brain.images.exist()) {
    const history: ICandle[] = await binance.getHistory("BTCUSDT", "2h", true);
    const samples: ISamples = brain.samples.create(history);

    await brain.train.run(samples);
  }

  await brain.images
    .load()
    .then(model => {
      console.info("Neural network snapshot loaded successfully.");

      setInterval(async () => {
        for (let symbol in getConfig().directions) {
          for (let interval of getConfig().directions[symbol].intervals) {
            track(model, symbol as Symbol, interval).catch(
              ({ message }: Error) => {
                console.error(
                  `Failed to get direction information ${symbol} with interval ${interval}: ${message}.`
                );
              }
            );
          }
        }
      }, 60 * 1000);
    })
    .catch(({ message }) => {
      throw new Error(`Failed to load neural network image: ${message}`);
    });
})();
