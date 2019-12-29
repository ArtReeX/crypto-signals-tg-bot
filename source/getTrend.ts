import { ICandle } from "./types";
import * as ti from "technicalindicators";

export type Trend = "BULLISH" | "BEARISH" | "NEUTRAL";

export default (sequence: ICandle[]): Trend => {
  const open = sequence.map(c => c.open);
  const close = sequence.map(c => c.close);
  const high = sequence.map(c => c.high);
  const low = sequence.map(c => c.low);

  const bullish = ti.bullish({ open, close, high, low });
  const bearish = ti.bearish({ open, close, high, low });

  if (bullish) {
    return "BULLISH";
  }
  if (bearish) {
    return "BEARISH";
  }
  return "NEUTRAL";
};
