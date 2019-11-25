"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("./brain/index"));
const createSamples_1 = __importDefault(require("./brain/createSamples"));
const binance_1 = __importDefault(require("./binance"));
(async () => {
    index_1.default(createSamples_1.default(await binance_1.default.getHistory("BTCUSDT", "1w")));
})();
//# sourceMappingURL=index.js.map