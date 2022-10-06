import { exec } from "child_process";
import { token } from "../../env";

const run = (command) =>
  new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error.message);
      }
      console.log(stdout, stderr);
      resolve(stdout);
    });
  });

const build = ({ chat_id, message_id = "12345" }) => {
  try {
    run(`src/script/build.sh ${token} ${chat_id} ${message_id}`);
  } catch (error) {
    console.log("error", error);
  }
};

export const cmd = {
  run,
  build,
};
