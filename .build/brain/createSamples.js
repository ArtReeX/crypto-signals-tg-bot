"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utilities_1 = __importDefault(require("./utilities"));
const SEQ = 10;
exports.default = (candles) => {
    const samples = { x: [], y: [] };
    for (let count = 0; count + SEQ < candles.length; count++) {
        samples.x.push(candles
            .slice(count, count + SEQ - 1)
            .map(candle => utilities_1.default.toArray(candle)));
        samples.y.push(utilities_1.default.toArray(candles[count + SEQ - 1]));
    }
    return samples;
};
//# sourceMappingURL=createSamples.js.map