import { ICandle } from "../types";
import * as ti from "technicalindicators";
import _ from "lodash";

export const candlesToIndicators = (candles: ICandle[]): number[][] => {
  const open = candles.map(c => c.open);
  const close = candles.map(c => c.close);
  const high = candles.map(c => c.high);
  const low = candles.map(c => c.low);

  const indicators = {
    stochRsi: ti.stochasticrsi({
      values: close,
      rsiPeriod: 14,
      stochasticPeriod: 9,
      kPeriod: 3,
      dPeriod: 3
    }),

    macd: ti.macd({
      values: close,
      fastPeriod: 12,
      slowPeriod: 26,
      signalPeriod: 9,
      SimpleMAOscillator: false,
      SimpleMASignal: false
    })
  };

  const maxLength = _.min(_.values(indicators).map(i => i.length)) || 0;

  const indicatorsFixed = _.zipObject(
    _.keys(indicators),
    _.values(indicators).map(i => i.slice(i.length - maxLength))
  );

  return _.values(_.values(indicatorsFixed)[0]).map((__, index) =>
    [_.values(indicatorsFixed).map(i => _.values(i[index]))].flat(Infinity)
  );
};

export const upwardTrend = (candles: ICandle[], period: number) => {
  const closes = candles.map(c => c.close);

  const gains = averageGain(closes, period);
  const losses = averageLoss(closes, period);

  return _.sum(gains) > _.sum(losses);
};

export const averageGain = (
  values: number[],
  period: number,
  presiction: number = 64
): number[] => {
  const averages: number[] = [];

  for (let countPeriod = period; countPeriod < values.length; countPeriod++) {
    const sequence = values.slice(countPeriod - period, countPeriod);

    let gainSum = 0;
    for (let countSeq = 1; countSeq < sequence.length; countSeq++) {
      const gain = sequence[countSeq] - sequence[countSeq - 1];
      if (gain > 0) {
        gainSum += gain;
      }
    }

    averages.push(gainSum / period);
  }

  return averages.map(average => Number(average.toPrecision(presiction)));
};

export const averageLoss = (
  values: number[],
  period: number,
  presiction: number = 64
): number[] => {
  const averages: number[] = [];

  for (let countPeriod = period; countPeriod < values.length; countPeriod++) {
    const sequence = values.slice(countPeriod - period, countPeriod);

    let gainSum = 0;
    for (let countSeq = 1; countSeq < sequence.length; countSeq++) {
      const gain = sequence[countSeq - 1] - sequence[countSeq];
      if (gain > 0) {
        gainSum += gain;
      }
    }

    averages.push(gainSum / period);
  }

  return averages.map(average => Number(average.toPrecision(presiction)));
};
