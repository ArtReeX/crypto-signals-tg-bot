"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const toArray = (candle) => Object.values(candle).map((value) => 1 / Number(value));
const toObject = (array) => ({
    open: array[0],
    high: array[1],
    low: array[2],
    close: array[3],
    volume: array[4],
    quoteVolume: array[5],
    trades: array[6],
    baseAssetVolume: array[7],
    quoteAssetVolume: array[8]
});
exports.default = { toArray, toObject };
//# sourceMappingURL=utilities.js.map