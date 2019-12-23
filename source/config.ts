const config: IConfig = require(process.env.CONFIG_PATH || "../config.json");

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

export interface IDirections {
  [key: string]: { intervals: [Interval] };
}

interface IConfig {
  telegram: {
    token: string;
    chat: number;
  };
  directions: IDirections;
}

export default (): IConfig => config;
