import http from "http";
import path from "path";
import express from "express";
import cors from "cors";
import fs from "fs";
import chokidar from "chokidar";
import { info } from "./utils/logger.js";
import appendRefresh from "./utils/appendHTML.js";
import generateRefresh from "./utils/generateRefresh.js";
import cleanup from "./utils/cleanup.js";
import getContentTypeByFileExt from "./utils/getContentTypeByFileExt.js";

// defaults, todo move to dif location
export const defaultRoot = "./public";
export const defaultEntry = "index.html";
export const defaultUrl = "http://localhost:";
export const defaultPort = 3000;
export const encoding = "utf-8";

const isWin = process.platform === "win32";
const app = express();
app.use(cors());
let client = null;
let port = defaultPort;
const start = (options = { port, slashtype }) => {
  const backslash = options?.slashtype
    ? options?.slashtype
    : isWin
    ? "\\"
    : "/";
  port = options?.port || defaultPort;
  const serveDir = path.join(process.cwd(), options.root ?? defaultRoot);
  const serveFile = serveDir + backslash + defaultEntry;
  const severUrl = defaultUrl + port;
  // setup refresh
  appendRefresh(serveFile);
  generateRefresh(severUrl, serveDir + backslash + "refresh.js");
  info("Sent the Herald ~~");
  const sendRefresh = () => {
    if (client) {
      info("changed detected ...");
      client.write("data: refresh\n\n");
      info("browser updated ", true);
    }
  };
  // setup app
  app.use((req, res, next) => {
    const filePath = path.join(serveDir, req.path);
    const fileExt = path.extname(filePath);

    if (fileExt) {
      fs.stat(filePath, (err, stat) => {
        if (err && err.code === "ENOENT") {
          res.status(404).send("File not found");
        } else {
          res.setHeader("Content-Type", getContentTypeByFileExt(fileExt));
          res.sendFile(filePath);
        }
      });
    } else {
      next();
    }
  });

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
  app.get("/*", function (req, res, next) {
    if (path.extname(req.path) === "") {
      res.sendFile(path.join(serveDir, "index.html"));
    } else {
      next();
    }
  });
  const server = http.createServer(app);
  server.listen(app.get("port"), () => {
    chokidar
      .watch(serveDir, { usePolling: true })
      .on("all", () => sendRefresh());
  });
  const runningServer = "Listening on port: " + port;
  info(runningServer);

  // clean up on exit
  process.stdin.resume();
  function exitHandler(options) {
    if (options.cleanup) {
      cleanup(serveDir + backslash + "refresh.js", serveFile);
    }
    if (options.exit) {
      process.exit();
    }
  }
  // catch majority -> clean then exit
  process.on("exit", exitHandler.bind(null, { cleanup: true }));
  process.on("SIGINT", exitHandler.bind(null, { exit: true }));
  process.on("SIGUSR1", exitHandler.bind(null, { exit: true }));
  process.on("SIGUSR2", exitHandler.bind(null, { exit: true }));
  process.on("uncaughtException", exitHandler.bind(null, { exit: true }));
};

export default start;
