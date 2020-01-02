import _ from "lodash";
import { Interval } from "./config";

export const sma = (values: number[], period: number): number[] => {
  const result = [];

  for (let count = period; count <= values.length; count++) {
    result.push(_.sum(values.slice(count - period, count)) / period);
  }

  return result;
};

export const ema = (values: number[], period: number): number[] => {
  const result = [...sma(values.slice(0, period), period)];

  for (let count = period; count < values.length; count++) {
    const factor = 2 / (period + 1);
    const current = values[count];
    const prevEma = result[result.length - 1];

    result.push((current - prevEma) * factor + prevEma);
  }

  return result;
};

export const differenceInPercent = (first: number, second: number): number =>
  ((first - second) / Math.min(first, second)) * 100;

export const intervalInMinutes = (interval: Interval): number => {
  switch (interval) {
    case "1m": {
      return 1;
    }
    case "3m": {
      return 3;
    }
    case "5m": {
      return 5;
    }
    case "15m": {
      return 15;
    }
    case "30m": {
      return 30;
    }
    case "1h": {
      return 60;
    }
    case "2h": {
      return 60 * 2;
    }
    case "4h": {
      return 60 * 4;
    }
    case "6h": {
      return 60 * 6;
    }
    case "12h": {
      return 60 * 12;
    }
    case "1d": {
      return 60 * 24;
    }
    case "3d": {
      return 60 * 24 * 3;
    }
    case "1w": {
      return 60 * 24 * 7;
    }
    case "1M": {
      return 60 * 24 * 7 * 30;
    }
  }
};
