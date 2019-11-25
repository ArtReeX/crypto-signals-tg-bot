import { ICandle } from "./types";
import utilities from "./utilities";

const SEQ = 10;

export interface ISamples {
  x: number[][][];
  y: number[][];
}

export default (candles: ICandle[]): ISamples => {
  const samples: ISamples = { x: [], y: [] };

  for (let count = 0; count + SEQ < candles.length; count++) {
    samples.x.push(
      candles
        .slice(count, count + SEQ - 1)
        .map(candle => utilities.toArray(candle))
    );
    samples.y.push(utilities.toArray(candles[count + SEQ - 1]));
  }

  return samples;
};
