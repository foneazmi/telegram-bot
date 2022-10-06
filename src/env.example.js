import dotenv from "dotenv";
dotenv.config();

export const token = process?.env?.TELEGRAM_TOKEN || "";
export const env = process?.env?.NODE_ENV || "";
export const url = process?.env?.HEROKU_URL || "";
export const port = process?.env?.PORT || 30001;
export const consumer_key = process?.env?.CONSUMER_KEY || "";
export const consumer_secret = process?.env?.CONSUMER_SECRET || "";
export const access_token_key = process?.env?.ACCESS_TOKEN_KEY || "";
export const access_token_secret = process?.env?.ACCESS_TOKEN_SECRET || "";

export const admin = process?.env?.ADMIN || ["username"];
export const toChannel = process?.env?.TO_CHANNEL || {
  video: "channelId",
  photo: "channelId",
};
