import fs from "fs";
import { error } from "./logger.js";
import { addScript } from "../template/attach-script.js";

const appendRefresh = async (file) => {
  let fileContents = null;
  let hasRefresh = false;
  try {
    fileContents = fs.readFileSync(file, "utf8");
    if (fileContents.includes(addScript)) {
      hasRefresh = true;
    } else {
      fileContents = fileContents.replace(/\<\/body>/g, addScript);
    }
  } catch (err) {
    return error("failed read entry file: " + err);
  }
  if (fileContents && !hasRefresh) {
    try {
      fs.writeFileSync(file, fileContents);
    } catch (err) {
      return error("failed add script: " + err);
    }
  }
};

export default appendRefresh;
