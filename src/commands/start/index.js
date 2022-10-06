import { bot } from "../../bot";
import { isAdmin as adminChecker } from "../../helpers";
export const start = (msg) => {
  const messages = "List Command";
  const isAdmin = adminChecker(msg);
  bot.sendMessage(msg.chat.id, messages, {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: `Wallpaper`,
            callback_data: `wallMenu`,
          },
          {
            text: `Get ID`,
            callback_data: `/id`,
          },
        ],
        ...(isAdmin
          ? [
              [
                {
                  text: `Status VPS`,
                  callback_data: `statusCommand`,
                },
              ],
            ]
          : []),
      ],
    },
  });
};
