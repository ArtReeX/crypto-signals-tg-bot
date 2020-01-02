import Binance from "binance-api-node";

export default async (): Promise<string[]> =>
  (await Binance().exchangeInfo()).symbols
    .filter(({ status }) => status === "TRADING")
    .map(({ symbol }) => symbol);
