import binance from "./binance";
import bot from "./bot";
import getConfig from "./config";
import getTrend, { Trend } from "./getTrend";
import limiter from "./limiter";
import { ICandle } from "./types";

const { symbols, intervals } = getConfig();

const trendToWord = (trend: Trend): string => {
  switch (trend) {
    case "BULLISH":
      return "бычий";
    case "BEARISH":
      return "медвежий";
    default:
      return "нейтральный";
  }
};

(async () => {
  const lastTrends: { [key: string]: Trend } = {};

  for (; true; ) {
    try {
      const requests: { [key: string]: Promise<ICandle[]> } = {};
      for (let symbol of symbols) {
        for (let interval of intervals) {
          requests[symbol + interval] = binance.getHistory(symbol, interval);
        }
      }

      const executed = await limiter(requests);
      const trends: { [key: string]: Trend } = {};

      for (const direction in executed) {
        trends[direction] = getTrend(executed[direction]);
      }

      const listOfTrends = Object.keys(trends)
        .sort()
        .filter(direction => {
          if (
            lastTrends[direction] === undefined ||
            lastTrends[direction] !== trends[direction]
          ) {
            lastTrends[direction] = trends[direction];
            return true;
          } else {
            return false;
          }
        })
        .map(
          direction => `${direction} - ${trendToWord(trends[direction])} тренд.`
        );

      if (listOfTrends.length) {
        bot.sendMessage(listOfTrends.join("\n"));
      }
    } catch ({ message }) {
      console.error(message);
    }
  }
})();
