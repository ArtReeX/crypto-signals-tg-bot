"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const brain_1 = __importDefault(require("./brain"));
const binance_1 = __importDefault(require("./binance"));
(async () => {
    if (!brain_1.default.images.exist()) {
        const history = await binance_1.default.getHistory("BTCUSDT", "15m");
        const samples = brain_1.default.samples.create(history);
        await brain_1.default.train.run(samples);
    }
    try {
        const model = await brain_1.default.images.load();
        console.info("Neural network snapshot loaded successfully.");
    }
    catch ({ message }) {
        throw new Error(`Failed to load neural network image: ${message}`);
    }
})();
//# sourceMappingURL=index.js.map