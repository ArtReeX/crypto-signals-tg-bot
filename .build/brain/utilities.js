"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toArray = (candle) => Object.values(candle).map((value) => Number(value));
exports.toObject = (array) => ({
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
exports.default = { toArray: exports.toArray, toObject: exports.toObject };
//# sourceMappingURL=utilities.js.map