import { bot } from "../../bot";
import axios from "axios";
import qs from "qs";

const queryFilter = (rawQuery) => {
  let query = {
    apikey: "FCJnF4ambSJaBsD9vbp7ePLiHlvNw6R8",
    purity: "100",
    categories: "100",
  };
  rawQuery.map((e) => {
    let each = e.split(":");
    if (each[0] === "q") {
      query = { ...query, q: each[1] };
    } else if (each[0] === "categories") {
      query = { ...query, categories: each[1] };
    } else if (each[0] === "purity") {
      query = { ...query, purity: each[1] };
    } else if (each[0] === "sorting") {
      query = { ...query, sorting: each[1] };
    } else if (each[0] === "order") {
      query = { ...query, order: each[1] };
    } else if (each[0] === "topRange") {
      query = { ...query, topRange: each[1] };
    } else if (each[0] === "atleast") {
      query = { ...query, atleast: each[1] };
    } else if (each[0] === "resolutions") {
      query = { ...query, resolutions: each[1] };
    } else if (each[0] === "ratios") {
      query = { ...query, ratios: each[1] };
    } else if (each[0] === "colors") {
      query = { ...query, colors: each[1] };
    } else if (each[0] === "page") {
      query = { ...query, page: each[1] };
    } else if (each[0] === "seed") {
      query = { ...query, seed: each[1] };
    } else if (each[0] === "nsfw") {
      query = { ...query, purity: "111" };
    }
  });
  return query;
};

const wallhaven = async (msg) => {
  let query = msg.text.split(" ").slice(1);
  let payload = queryFilter(query);
  let isPageFound = query.find((e) => e.includes("page"));
  let page = (isPageFound && Number(isPageFound.split(":")[1])) || 1;
  let newQuery = query.filter((e) => !e.includes("page"));
  query = qs.stringify(payload);
  let data = await axios.get(`https://wallhaven.cc/api/v1/search?${query}`);
  let index = 0;
  const sendImageInQueue = async ({ data }) => {
    if (index > data.length) {
      // const listCommand = [
      //   { title: "General", query: "categories:100" },
      //   { title: "Anime", query: "categories:010" },
      // ];
      bot.sendMessage(
        msg.chat.id,
        `/wall page:${page + 1} ${newQuery && newQuery?.join(" ")}`,
        {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: `Menu`,
                  callback_data: `/start`,
                },
                {
                  text: `Wallhaven`,
                  callback_data: `wallMenu`,
                },
                {
                  text: `Next`,
                  callback_data: `/wall page:${page + 1} ${
                    newQuery && newQuery?.join(" ")
                  }`,
                },
              ],
            ],
          },
        }
      );
    } else {
      try {
        await bot.sendPhoto(msg.chat.id, data[index]?.thumbs.original, {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: `Open`,
                  url: data[index]?.path,
                },
                {
                  text: `Send`,
                  callback_data: `#wallSendOri ${data[index]?.path}`,
                },
              ],
            ],
          },
        });
        index++;
        return sendImageInQueue({ data });
      } catch (error) {
        index++;
        return sendImageInQueue({ data });
      }
    }
  };

  sendImageInQueue({
    data: data.data.data,
  });
};

const wallSendOri = async (msg) => {
  let query = msg.text.split(" ").slice(1);
  try {
    await bot.sendDocument(msg.chat.id, query[0], {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: `Open`,
              url: query[0],
            },
          ],
        ],
      },
    });
  } catch (error) {
    await bot.sendMessage(msg.chat.id, "Failed to send image", {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: `Open`,
              url: query[0],
            },
          ],
        ],
      },
    });
  }
};

const wallMenu = (msg) => {
  bot.sendMessage(msg.chat.id, "Menu", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: `Get Latest Wallpaper`,
            callback_data: `/wall`,
          },
          {
            text: `All`,
            callback_data: `/wall categories:111 nsfw`,
          },
        ],
        [
          {
            text: `General`,
            callback_data: `/wall categories:100`,
          },
          {
            text: `Anime`,
            callback_data: `/wall categories:010`,
          },
          {
            text: `People`,
            callback_data: `/wall categories:001`,
          },
        ],
        [
          {
            text: `Landscape`,
            callback_data: `/wall ratios:landscape`,
          },
          {
            text: `Portrait`,
            callback_data: `/wall ratios:portrait`,
          },
        ],
        [
          {
            text: `Desc`,
            callback_data: `/wall order:desc`,
          },
          {
            text: `Asc`,
            callback_data: `/wall order:asc`,
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

export const wallCommandList = {
  wallMenu,
  "/wall": wallhaven,
  "#wallSendOri": wallSendOri,
};
