"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utilities_1 = require("./utilities");
const getConfig_1 = __importDefault(require("../getConfig"));
const create = (candles, sequence = getConfig_1.default().tensorflow.sequence) => {
    const samples = { x: [], y: [] };
    for (let count = 0; count + sequence < candles.length; count++) {
        samples.x.push(candles
            .slice(count, count + sequence - 1)
            .map(candle => utilities_1.normalize(utilities_1.toArray(candle))));
        samples.y.push(utilities_1.normalize(utilities_1.toArray(candles[count + sequence - 1])));
    }
    return samples;
};
exports.default = { create };
//# sourceMappingURL=samples.js.map