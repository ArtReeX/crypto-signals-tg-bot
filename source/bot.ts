import TelegramBot from "node-telegram-bot-api";
import getConfig from "./getConfig";

const {
  telegram: { token, chat }
} = getConfig();

const bot = new TelegramBot(token, { polling: true });

const sendMessage = (message: string) => bot.sendMessage(chat, message);

export default { sendMessage };
