"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utilities_1 = require("./utilities");
const normalization_1 = __importDefault(require("./normalization"));
const decision = (first, last) => {
    const percents = (first[first.length - 1].close - last[last.length - 1].close) /
        last[last.length - 1].close;
    if (Math.abs(percents) >= 0.05) {
        return percents > 0 ? [0, 0, 0, 0, 1] : [1, 0, 0, 0, 0];
    }
    else if (Math.abs(percents) >= 0.01) {
        return percents > 0 ? [0, 0, 0, 1, 0] : [0, 1, 0, 0, 0];
    }
    return [0, 0, 0, 0, 0];
};
const create = (candles, sequence) => {
    const samples = { x: [], y: [] };
    const scaler = new normalization_1.default(candles.map((candle) => utilities_1.toArray(candle)));
    for (let count = 0; count + sequence < candles.length; count++) {
        samples.x.push(scaler.normalize2d().slice(count, count + sequence - 1));
        samples.y.push(decision(candles.slice(count, count + sequence - 1), candles.slice(count + sequence - 1, count + sequence)));
    }
    return samples;
};
exports.default = { create };
//# sourceMappingURL=samples.js.map