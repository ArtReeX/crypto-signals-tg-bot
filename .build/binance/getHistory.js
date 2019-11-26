"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const moment_1 = __importDefault(require("moment"));
const URL = "https://api.binance.com/api/v3";
const subtract = (time, interval) => {
    const unit = Number(interval.replace(/\D/, "")) * 1000;
    if (interval.includes("m")) {
        return moment_1.default(time).subtract(unit, "minute");
    }
    if (interval.includes("h")) {
        return moment_1.default(time).subtract(unit, "hour");
    }
    if (interval.includes("d")) {
        return moment_1.default(time).subtract(unit, "day");
    }
    if (interval.includes("w")) {
        return moment_1.default(time).subtract(unit, "week");
    }
    if (interval.includes("M")) {
        return moment_1.default(time).subtract(unit, "month");
    }
    return moment_1.default(time);
};
exports.default = async (symbol, interval, allTime = false) => {
    let candles = [];
    for (let time = moment_1.default(), lowerBound = allTime
        ? moment_1.default().subtract(2, "year")
        : subtract(time, interval); time.isSameOrAfter(lowerBound) && time.isSameOrAfter("2000-01-01"); time = subtract(time, interval)) {
        const result = await axios_1.default.get(`${URL}/klines`, {
            params: {
                symbol,
                interval,
                limit: 1000,
                startTime: subtract(time, interval).valueOf(),
                endTime: time.valueOf()
            }
        });
        candles.push(...result.data);
    }
    return candles.reverse().map((candle) => ({
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