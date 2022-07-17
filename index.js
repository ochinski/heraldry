import http from "http";
import fs from "fs";
import path from "path";
import express from "express";
import cors from "cors";
import chokidar from "chokidar";
import { info } from "./utils/logger.js";
import appendRefresh from "./utils/appendHTML.js";
import generateRefresh from "./utils/generateRefresh.js";

// defaults, todo move to dif location
export const defaultRoot = "./public";
export const defaultEntry = "index.html";
export const defaultUrl = "http://localhost:";
export const defaultPort = 3000;
export const encoding = "utf-8";

const app = express();
app.use(cors());
const __dirname = path.resolve();

let serveDir = defaultRoot;
let currentUrl = null;
let client = null;
let port = defaultPort;
const start = (options = {}) => {
  let changed = false;
  port = options?.port || defaultPort;

  const serveDir = path.join(__dirname, options.root ?? defaultRoot);
  const serveFile = serveDir + "\\" + defaultEntry;
  const severUrl = defaultUrl + defaultPort;

  // setup refresh
  appendRefresh(serveFile);
  generateRefresh(severUrl, serveDir + "\\refresh.js");
  info("Sent the Herald ~~");

  const sendRefresh = () => {
    if (client) {
      info("changed detected ...");
      client.write("data: refresh\n\n");
      info("browser updated ", true);
    }
  };
  // setup app
  app.use(express.static(path.join(serveDir)));
  app.set("port", options.port || defaultPort);
  app.get("/subscribe", (req, res) => {
    const headers = {
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
      "Cache-Control": "no-cache",
    };
    res.writeHead(200, headers);
    res.write("you are subscribed\n\n");
    client = res;
    req.on("close", () => {
      client = null;
    });
  });
  app.get("/*", function (req, res) {
    res.sendFile(path.join(serveDir, "index.html"));
    currentUrl = req.originalUrl;
  });
  const server = http.createServer(app);
  server.listen(app.get("port"), () => {
    const watcher = chokidar.watch(serveDir);
    watcher
      .on("add", (_) => sendRefresh())
      .on("change", (_) => sendRefresh())
      .on("unlink", (_) => sendRefresh());
  });
  const runningServer = "Listening on port: " + port;
  info(runningServer);
};
export default start;
