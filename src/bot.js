import TelegramBot from "node-telegram-bot-api";
import { token, env, url } from "./env";
import { getFirstWord, twitterRegex, profileTwitterRegex } from "./helpers";
import {
  start,
  wallCommandList,
  getTwitterMedia,
  crawlTwitterData,
  vpsCommandList,
  // albumCommandList,
  chatCommandList,
  twitterCommandList,
} from "./commands";

let bot;
if (env === "production") {
  console.log("webhook");
  console.log("token", token);
  bot = new TelegramBot(token);
  bot.setWebHook(url + bot.token);
} else {
  console.log("token", token);
  bot = new TelegramBot(token, {
    polling: true,
  });
}

bot.on("polling_error", (error) => {
  console.log(error);
});

bot.on("webhook_error", (error) => {
  console.log(error.code);
});

const commandList = {
  "/start": start,
  "/home": start,
  ...chatCommandList,
  ...wallCommandList,
  ...vpsCommandList,
  // ...albumCommandList,
  ...twitterCommandList,
};

const command = (msg) => {
  // bot.deleteMessage(msg.chat.id, msg.message_id);
  const run = commandList[getFirstWord(msg.text)] || (() => {});
  run(msg);
};

//? handle twitter link
bot.onText(twitterRegex, (msg, match) => getTwitterMedia(match[1], msg));
bot.onText(profileTwitterRegex, (msg, match) =>
  crawlTwitterData(match[2], msg)
);

//? handle ordinary command
bot.on("message", (msg) => {
  command(msg);
});

bot.on("pinned_message", (msg) =>
  bot.deleteMessage(msg.chat.id, msg.message_id)
);

//? handle callback
bot.on("callback_query", async (msg) => {
  msg.message.text = msg.data;
  bot.deleteMessage(msg.message.chat.id, msg.message.message_id);
  command(msg.message);
});

export { bot };
