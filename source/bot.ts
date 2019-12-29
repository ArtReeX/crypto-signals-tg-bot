import TelegramBot from "node-telegram-bot-api";
import getConfig from "./config";

const {
  telegram: { token, chat }
} = getConfig();

const bot = new TelegramBot(token, { polling: false });

const sendMessage = (message: string) =>
  bot.sendMessage(chat, message, { parse_mode: "Markdown" });

export default { sendMessage };
