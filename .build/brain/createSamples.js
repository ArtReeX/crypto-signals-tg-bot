"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utilities_1 = require("./utilities");
const SEQ = 10;
exports.default = (candles) => {
    const samples = { x: [], y: [] };
    for (let count = 0; count + SEQ < candles.length; count++) {
        samples.x.push(candles
            .slice(count, count + SEQ - 1)
            .map(candle => utilities_1.normalize(utilities_1.toArray(candle))));
        samples.y.push(utilities_1.normalize(utilities_1.toArray(candles[count + SEQ - 1])));
    }
    return samples;
};
//# sourceMappingURL=createSamples.js.map