"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./brain/types");
const binance_1 = __importDefault(require("./binance"));
const brain_1 = __importDefault(require("./brain"));
const bot_1 = __importDefault(require("./bot"));
bot_1.default.sendMessage("ji");
exports.default = async (model, symbol, interval) => {
    const candles = await binance_1.default.getHistory(symbol, interval);
    const decision = brain_1.default.predict(model, candles);
    switch (decision) {
        case types_1.Decision.ConfidentSale: {
            console.info(`The direction ${symbol} with the interval ${interval} is a sure sale.`);
            break;
        }
        case types_1.Decision.InsecureSale: {
            console.info(`The direction ${symbol} with the interval ${interval} is an uncertain sale.`);
            break;
        }
        case types_1.Decision.ConfidentPurchase: {
            console.info(`The direction ${symbol} with the interval ${interval} is a sure buy.`);
            break;
        }
        case types_1.Decision.InsecurePurchase: {
            console.info(`The direction ${symbol} with the interval ${interval} is an uncertain purchase.`);
            break;
        }
        default: {
            console.info(`The direction ${symbol} with the interval ${interval} is neutral.`);
            break;
        }
    }
};
//# sourceMappingURL=track.js.map