const config: IConfig = require(process.env.CONFIG_PATH || "../config.json");

export type Symbol = "BTCUSDT" | "ETHUSDT";
export type Interval =
  | "1m"
  | "3m"
  | "5m"
  | "15m"
  | "30m"
  | "1h"
  | "2h"
  | "4h"
  | "6h"
  | "12h"
  | "1d"
  | "3d"
  | "1w"
  | "1M";

interface IConfig {
  tensorflow: {
    sequence: number;
  };
  directions: {
    pair: Symbol;
    intervals: [Interval];
  }[];
}

export default (): IConfig => config;
