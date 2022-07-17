import fs from "fs";
import { error } from "./logger.js";

const generateRefresh = async (url, location) => {
  let content = `const updateBrowser = () => {
    window.location.reload();
  };
  const refresh = () => {
    const evtSource = new EventSource("<url>/subscribe");
    evtSource.onmessage = () => {
      updateBrowser();
    };
  };
  refresh();
  `;
  content = content.replace(/<url>/g, url);
  fs.writeFile(location, content, (err) => {
    if (err) {
      return error(err);
    }
  });
};

export default generateRefresh;
