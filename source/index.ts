import binance from "./binance";
import Core from "./core/Core";
import { ISamples } from "./core/types";
import { ICandle } from "./types";
import limiter from "./limiter";
import _ from "lodash";
import config, { Interval } from "./config";
import bot from "./bot";

const { symbols, intervals } = config();

(async () => {
  const core = new Core({
    previousSeq: 15,
    futureSeq: 1,
    numberOfParameters: 4
  });

  if (!(await core.loadModelIfExist())) {
    const samples: ISamples = { xs: [], ys: [] };

    const requests: { [key: string]: Promise<ICandle[]> } = {};

    for (const symbol of ["BTCUSDT"]) {
      for (const interval of ["2h", "4h", "6h"] as Interval[]) {
        requests[symbol + interval] = binance.getHistory(
          symbol,
          interval,
          true
        );
      }
    }

    const executed = await limiter.execute(requests);

    for (const request of _.values(executed)) {
      const partialSamples = core.createSamples(request);

      samples.xs.push(...partialSamples.xs);
      samples.ys.push(...partialSamples.ys);
    }

    await core.train(samples);
  }

  const last: { [key: string]: ICandle[] } = {};

  for (; true; ) {
    const requests: { [key: string]: Promise<ICandle[]> } = {};
    for (const symbol of symbols) {
      for (const interval of intervals) {
        requests[symbol + interval] = binance.getHistory(symbol, interval);
      }
    }

    const executed = await limiter.execute(requests);

    for (const direction in executed) {
      const result = core.predict(executed[direction]);

      if (!_.isEqual(last[direction], result)) {
        last[direction] = _.cloneDeep(result);
        bot.sendMessage(`[${direction}] - ${result[0].close.toFixed(8)}`);
      }
    }

    await limiter.sleep(30);
  }
})();
