"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const brain_1 = __importDefault(require("./brain"));
const createSamples_1 = __importDefault(require("./brain/createSamples"));
const binance_1 = __importDefault(require("./binance"));
const fs_1 = __importDefault(require("fs"));
const tf = __importStar(require("@tensorflow/tfjs-node"));
(async () => {
    if (!fs_1.default.existsSync("./model")) {
        const history = await binance_1.default.getHistory("BTCUSDT", "15m");
        const samples = createSamples_1.default(history);
        await brain_1.default.train(samples);
    }
    const model = await tf.loadLayersModel("file://./model/model.json");
})();
//# sourceMappingURL=index.js.map