"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
exports.default = async (symbol, interval, limit = 1000) => {
    const { data } = await axios_1.default.get("https://api.binance.com/api/v3/klines", {
        params: {
            symbol,
            interval,
            limit
        }
    });
    return data.map((candle) => ({
        open: candle[1],
        high: candle[2],
        low: candle[3],
        close: candle[4],
        volume: candle[5],
        quoteVolume: candle[7],
        trades: candle[8],
        baseAssetVolume: candle[9],
        quoteAssetVolume: candle[10]
    }));
};
//# sourceMappingURL=getHistory.js.map