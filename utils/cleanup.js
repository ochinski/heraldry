import fs from "fs";
import { error } from "./logger.js";
import { addScript } from "../template/attach-script.js";

const cleanup = (toDel, file) => {
  let fileContents = null;
  let hasRefresh = false;
  try {
    fs.unlinkSync(toDel);
    //file removed
  } catch (err) {
    return error(err);
  }
  try {
    fileContents = fs.readFileSync(file, "utf8");
    if (fileContents.includes(addScript)) {
      hasRefresh = true;
      fileContents = fileContents.replace(addScript, "</body>");
    }
  } catch (err) {
    return error(err);
  }
  if (hasRefresh && fileContents) {
    try {
      fs.writeFileSync(file, fileContents);
    } catch (err) {
      return error(err);
    }
  }
};

export default cleanup;
