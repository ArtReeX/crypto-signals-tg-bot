"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const getConfig_1 = __importDefault(require("./getConfig"));
const { telegram: { token, chat } } = getConfig_1.default();
const bot = new node_telegram_bot_api_1.default(token, { polling: true });
const sendMessage = (message) => bot.sendMessage(chat, message);
exports.default = { sendMessage };
//# sourceMappingURL=bot.js.map