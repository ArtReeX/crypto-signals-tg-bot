import { ICandle } from "./types";
import { toArray, normalize } from "./utilities";
import getConfig from "../getConfig";

export interface ISamples {
  x: number[][][];
  y: number[][];
}

export default (
  candles: ICandle[],
  sequence: number = getConfig().tensorflow.sequence
): ISamples => {
  const samples: ISamples = { x: [], y: [] };

  for (let count = 0; count + sequence < candles.length; count++) {
    samples.x.push(
      candles
        .slice(count, count + sequence - 1)
        .map(candle => normalize(toArray(candle)))
    );
    samples.y.push(normalize(toArray(candles[count + sequence - 1])));
  }

  return samples;
};
