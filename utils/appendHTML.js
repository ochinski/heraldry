import { info } from "console";
import fs from "fs";
import { error } from "./logger.js";

const appendRefresh = async (file) => {
  let fileContents = null;
  let hasRefresh = null;
  const content = `</body><script src="refresh.js"></script>`;
  try {
    fileContents = fs.readFileSync(file, "utf8");
    if (fileContents.includes(content)) {
      hasRefresh = true;
    }
    fileContents = fileContents.replace(/\<\/body>/g, content);
  } catch (err) {
    return error(err);
  }
  if (fileContents && !hasRefresh) {
    try {
      fs.writeFileSync(file, fileContents);
    } catch (err) {
      return error(err);
    }
  }
};

export default appendRefresh;
