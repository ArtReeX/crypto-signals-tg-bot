"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getClient_1 = __importDefault(require("./getClient"));
exports.default = (symbol, interval, limit = 1000) => getClient_1.default().get("/api/v3/klines", {
    params: {
        symbol,
        interval
    }
});
//# sourceMappingURL=getHistory.js.map