import brain from "./brain";
import createSamples, { ISamples } from "./brain/createSamples";
import binance from "./binance";
import fs from "fs";
import * as tf from "@tensorflow/tfjs-node";
import { ICandle } from "./brain/types";

(async () => {
  if (!fs.existsSync("./model")) {
    const history: ICandle[] = await binance.getHistory("BTCUSDT", "15m");
    const samples: ISamples = createSamples(history);

    await brain.train(samples);
  }

  const model = await tf
    .loadLayersModel("file://./model/model.json")
    .then(() => console.log("Neural network snapshot uploaded successfully."))
    .catch(({ message }: Error) =>
      console.log(`Failed to load neural network image: ${message}`)
    );
})();
