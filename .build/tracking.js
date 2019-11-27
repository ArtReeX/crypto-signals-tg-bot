"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const binance_1 = __importDefault(require("./binance"));
const bot_1 = __importDefault(require("./bot"));
const brain_1 = __importDefault(require("./brain"));
const types_1 = require("./brain/types");
const lastDecisions = {};
exports.default = async (model, directions) => {
    for (let symbol in directions) {
        for (let interval of directions[symbol].intervals) {
            try {
                const candles = await binance_1.default.getHistory(symbol, interval);
                const decision = brain_1.default.predict(model, candles);
                if (decision !== lastDecisions[symbol]) {
                    lastDecisions[symbol] = decision;
                }
                else {
                    continue;
                }
                switch (decision) {
                    case types_1.Decision.ConfidentSale: {
                        bot_1.default.sendMessage(`The direction ${symbol} with the interval ${interval} is a sure sale.`);
                        break;
                    }
                    case types_1.Decision.InsecureSale: {
                        bot_1.default.sendMessage(`The direction ${symbol} with the interval ${interval} is an uncertain sale.`);
                        break;
                    }
                    case types_1.Decision.ConfidentPurchase: {
                        bot_1.default.sendMessage(`The direction ${symbol} with the interval ${interval} is a sure buy.`);
                        break;
                    }
                    case types_1.Decision.InsecurePurchase: {
                        bot_1.default.sendMessage(`The direction ${symbol} with the interval ${interval} is an uncertain purchase.`);
                        break;
                    }
                    default: {
                        bot_1.default.sendMessage(`The direction ${symbol} with the interval ${interval} is neutral.`);
                        break;
                    }
                }
            }
            catch ({ message }) {
                console.error(`Failed to get direction information ${symbol} with interval ${interval}: ${message}.`);
            }
        }
    }
};
//# sourceMappingURL=tracking.js.map