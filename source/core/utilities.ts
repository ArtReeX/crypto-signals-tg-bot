import _ from "lodash";

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
