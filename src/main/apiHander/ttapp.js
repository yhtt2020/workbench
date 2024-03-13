/**
 * ttapp.js
 */
const Base = require("./base");
// const appModel = require("../../model/appModel");

const useInstall = require("../ttApps/useInstall");
const useUninstall = require("../ttApps/useUninstall");
const { BrowserWindow } = require("electron");
class TTApp extends Base {
  instances = [];

  callbacks = {};

  constructor() {
    super("ttapp");
  }
  // 应该是接收主进程的消息
  bindIPC() {
    this.on("install", async (event, args) => {
      let res = await useInstall(args.zipPath);
      console.log("install res :>> ", res);
      event.reply(args.cbId, res);
    });

    this.on("uninstall", async (event, args) => {
      console.log("uninstall res :>> ", );
      let res = await useUninstall(args.id);
      event.reply(args.cbId, args);
    });
  }
}

module.exports = TTApp;
