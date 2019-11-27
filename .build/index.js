"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const binance_1 = __importDefault(require("./binance"));
const brain_1 = __importDefault(require("./brain"));
const getConfig_1 = __importDefault(require("./getConfig"));
const tracking_1 = __importDefault(require("./tracking"));
const { tensorflow: { sequence }, directions } = getConfig_1.default();
(async () => {
    if (!brain_1.default.images.exist()) {
        const history = await binance_1.default.getHistory("BTCUSDT", "2h", true);
        const samples = brain_1.default.samples.create(history, sequence);
        await brain_1.default.train.run(samples);
    }
    try {
        const model = await brain_1.default.images.load();
        console.info("Neural network snapshot loaded successfully.");
        tracking_1.default(model, directions);
        setInterval(async () => {
            tracking_1.default(model, directions);
        }, 60 * 1000);
    }
    catch ({ message }) {
        throw new Error(`Failed to load neural network image: ${message}`);
    }
})();
//# sourceMappingURL=index.js.map