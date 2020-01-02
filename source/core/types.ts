import * as tf from "@tensorflow/tfjs-node";

export interface ISamples {
  xs: number[][][];
  ys: number[][][];
}

export interface ICoreConfig {
  previousSeq: number;
  futureSeq: number;
  numberOfParameters: number;
  scale?: [tf.Scalar, tf.Scalar];
}

export interface ICandle {
  [key: string]: number;

  open: number;
  high: number;
  low: number;
  close: number;
}

export enum Trend {
  BULLISH = 1,
  NEUTRAL = 0,
  BEARISH = -1
}
