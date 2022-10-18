import express from "express";
import { port } from "./env";
import { bot } from "./bot";
import { youtube } from "scrape-youtube";

const app = express();
app.use(express.json());
app.listen(port, "0.0.0.0");

app.post("/" + bot.token, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

app.post("/webhook", (req, res) => {
  let { query, body } = req;
  let message = `WEBHOOK from ${query.clientName}`;
  Object.keys(body).map((e) => {
    message += `\n${e} : ${JSON.stringify(body[e])}`;
  });
  bot.sendMessage(query.chatId, message);
  res.sendStatus(200);
});

app.post("/log", (req, res) => {
  let { query, body } = req;
  if (body instanceof Array) {
    let response = "";
    body.map((element) => {
      if (typeof element === "object") {
        response += `\n${JSON.stringify(element)}`;
      } else {
        response += `\n${element}`;
      }
    });
    bot.sendMessage(query.chatId, `${response}`);
  } else {
    bot.sendMessage(query.chatId, `${JSON.stringify(body)}`);
  }
  res.sendStatus(200);
});

app.get("/yt", async (req, res) => {
  let { query } = req;
  let result = await youtube.search(query.q);
  res.json(result.videos);
  res.sendStatus(200);
});
