import { bot } from "../../bot";
import { twitter } from "../../services";
import { isAdmin } from "../../helpers";
import { toChannel } from "../../env";
import { TwitterApi } from "twitter-api-v2";

import {
  consumer_key,
  consumer_secret,
  access_token_key,
  access_token_secret,
} from "../../env";

const sendOtherKeyboard = (msg, tweetId, type) => {
  let admin = isAdmin(msg);
  return admin
    ? {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: `Send To Channel`,
                callback_data: `sendToOtherChannel ${toChannel[type]} ${tweetId}`,
              },
            ],
          ],
        },
      }
    : {};
};

export const getTwitterMedia = async (tweetId, msg) => {
  bot.deleteMessage(msg.chat.id, msg.message_id);
  const twitData = await twitter.media(tweetId);
  if (twitData.length > 1) {
    await bot.sendMediaGroup(msg.chat.id, twitData);
  } else {
    if (twitData[0].type === "photo") {
      await bot.sendPhoto(
        msg.chat.id,
        twitData[0].media,
        sendOtherKeyboard(msg, tweetId, "photo")
      );
    } else if (twitData[0].type === "video") {
      await bot.sendVideo(
        msg.chat.id,
        twitData[0].media,
        sendOtherKeyboard(msg, tweetId, "video")
      );
    }
  }
};
export const crawlTwitterData = async (username, msg) => {
  bot.deleteMessage(msg.chat.id, msg.message_id);
  const mediaGroups = await twitter.getDataByUsername({
    username,
  });
  if (mediaGroups.length !== 0) {
    if (mediaGroups.length < 10) {
      bot.sendMediaGroup(msg.chat.id, mediaGroups);
    } else {
      let [data, albumPage] = albumPageGrouping(mediaGroups);
      sendGroup({
        id: msg.chat.id,
        data,
        max: albumPage,
      });
    }
  }
};

const sendToOtherChannel = async (msg) => {
  let query = msg.text.split(" ").slice(1);
  const twitData = await twitter.media(query[1]);
  bot.sendMediaGroup(query[0], twitData);
};

const getAllTimelineCommand = async (msg) => {
  bot.deleteMessage(msg.chat.id, msg.message_id);
  let query = msg.text.split(" ").slice(1);
  const mediaGroups = await twitter.getDataByUsername({
    username: query[0],
    count: query[1],
  });
  if (mediaGroups.length !== 0) {
    if (mediaGroups.length < 10) {
      bot.sendMediaGroup(msg.chat.id, mediaGroups);
    } else {
      let [data, albumPage] = albumPageGrouping(mediaGroups);
      sendGroup({
        id: msg.chat.id,
        data,
        max: albumPage,
      });
    }
  }
};

const albumPageGrouping = (mediaGroups) => {
  let albumPage = Math.ceil(mediaGroups.length / 10);
  const chunkSize = 10;
  const data = [];
  for (let i = 0; i < albumPage; i++) {
    const chunk = mediaGroups.slice(i * chunkSize, i * chunkSize + chunkSize);
    data.push(chunk);
  }
  return [data, albumPage];
};

const sendGroup = ({ id, data, max, current = 0 }) => {
  setTimeout(async () => {
    try {
      if (current <= max) {
        await bot.sendMediaGroup(id, data[current]);
        return sendGroup({ id, data, max, current: current + 1 });
      }
    } catch (error) {
      //? send one by one if error
      //? ETELEGRAM: 400 Bad Request: wrong file identifier/HTTP URL specified
      sendOneByOne({ id, data: data[current], max: data[current].length });
      return sendGroup({ id, data, max, current: current + 1 });
    }
    //? add delay 6s to avoid 429 Too Many Requests
  }, 6000);
};

const sendOneByOne = async ({ id, data, max, current = 0 }) => {
  setTimeout(async () => {
    try {
      if (current <= max) {
        if (data[current].type === "photo") {
          await bot.sendPhoto(id, data[current].media);
        } else if (data[current].type === "video") {
          await bot.sendVideo(id, data[current].media);
        }
        return sendOneByOne({ id, data, max, current: current + 1 });
      }
    } catch (error) {
      console.log(error, data);
    }
    //? add delay 6s to avoid 429 Too Many Requests
  }, 6000);
};

const testTwitterSendFailed = (msg) => {
  let data = [];
  bot.sendMediaGroup(msg.chat.id, data);
};

export const twitterCommandList = {
  sendToOtherChannel,
  "/tt": getAllTimelineCommand,
  "/tts": testTwitterSendFailed,
};
