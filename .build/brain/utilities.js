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
exports.normalize = (array) => {
    const min = Math.min(...array);
    const max = Math.max(...array);
    return array.map((value) => (value - min) / (max - min));
};
exports.denormalize = (array) => {
    const min = Math.min(...array);
    const max = Math.max(...array);
    return array.map((value) => value * (max - min) + min);
};
exports.default = { toArray: exports.toArray, toObject: exports.toObject, normalize: exports.normalize };
//# sourceMappingURL=utilities.js.map