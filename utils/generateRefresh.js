import fs from "fs";
import { error } from "./logger.js";
import refresh from "../template/refresh.js";

const generateRefresh = async (url, location) => {
  let content = null;
  content = refresh.replace(/<url>/g, url);
  fs.writeFile(location, content, (err) => {
    if (err) {
      return error("failed to add url to refresh: " + err);
    }
  });
};

export default generateRefresh;
