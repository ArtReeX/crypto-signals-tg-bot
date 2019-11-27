"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const binance_1 = __importDefault(require("./binance"));
const brain_1 = __importDefault(require("./brain"));
const getConfig_1 = __importDefault(require("./getConfig"));
const track_1 = __importDefault(require("./track"));
(async () => {
    if (!brain_1.default.images.exist()) {
        const history = await binance_1.default.getHistory("BTCUSDT", "2h", true);
        const samples = brain_1.default.samples.create(history);
        await brain_1.default.train.run(samples);
    }
    await brain_1.default.images
        .load()
        .then(model => {
        console.info("Neural network snapshot loaded successfully.");
        setInterval(async () => {
            for (let symbol in getConfig_1.default().directions) {
                for (let interval of getConfig_1.default().directions[symbol].intervals) {
                    track_1.default(model, symbol, interval).catch(({ message }) => {
                        console.error(`Failed to get direction information ${symbol} with interval ${interval}: ${message}.`);
                    });
                }
            }
        }, 60 * 1000);
    })
        .catch(({ message }) => {
        throw new Error(`Failed to load neural network image: ${message}`);
    });
})();
//# sourceMappingURL=index.js.map