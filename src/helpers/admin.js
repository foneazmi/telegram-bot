import { admin } from "../env";

export const isAdmin = (msg) => {
  console.log(msg);
  return admin.includes(msg.chat.username);
};
