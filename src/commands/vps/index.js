import { bot } from "../../bot";
import os from "os";
import { cmd } from "../../services";
import { keyboard } from "../../helpers";
const version = process.env.npm_package_version;

let memory = () => {
  let freeMemory = Math.floor(os.freemem() / 1048576);
  let totalMemory = Math.floor(os.totalmem() / 1048576);
  return `\nRAM : ${totalMemory - freeMemory}MB / ${totalMemory}MB`;
};

let uptime = () => {
  let minute = Math.floor(os.uptime() / 60);
  let hour = minute > 60 ? Math.floor(minute / 60) : 0;
  hour = hour >= 10 ? hour : `0${hour}`;
  minute = minute % 60 > 10 ? minute % 60 : `0${minute % 60}`;
  return `\nUptime : ${hour}:${minute}`;
};

const statusCommand = async (msg) => {
  let message = `== ${os.hostname()} ==\nBot Version : ${version}${memory()}${uptime()}`;
  bot.sendMessage(msg.chat.id, message, {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: `Sync`,
            callback_data: `fetchAndBuildCommand`,
          },
          {
            text: `Refresh`,
            callback_data: `statusCommand`,
          },
        ],
        [
          {
            text: `Menu`,
            callback_data: `/start`,
          },
        ],
      ],
    },
  });
};

const fetchAndBuildCommand = async (msg) => {
  const reply = await bot.sendMessage(msg.chat.id, `🧱 Building.....`);
  cmd.build({
    chat_id: reply.chat.id,
    message_id: reply.message_id,
  });
};

const downloadCommand = async (msg) => {
  let query = msg.text.split(" ").slice(1);
  if (query.length > 0) {
    const reply = await bot.sendMessage(
      msg.chat.id,
      "🔥 Download started !!",
      keyboard.start
    );
    try {
      await cmd.run(`src/script/download.sh ${query[0]}`);
    } catch (error) {
      bot.deleteMessage(reply.chat.id, reply.message_id);
      bot.sendMessage(msg.chat.id, "💀 Download failed !!", keyboard.start);
      console.log("error", error);
    }
  }
};

export const vpsCommandList = {
  statusCommand,
  fetchAndBuildCommand,
  "/dl": downloadCommand,
};
