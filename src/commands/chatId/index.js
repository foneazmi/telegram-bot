import { bot } from "../../bot";
import { keyboard } from "../../helpers";
const chatId = (msg) => {
  bot.sendMessage(msg.chat.id, msg.chat.id, keyboard.start);
};

export const chatCommandList = {
  "/id": chatId,
};
