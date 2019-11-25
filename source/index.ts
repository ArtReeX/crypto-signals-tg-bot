import brain from "./brain";
import createSamples from "./brain/createSamples";
import binance from "./binance";

(async () => {
  brain.train(createSamples(await binance.getHistory("BTCUSDT", "1w")));
})();
