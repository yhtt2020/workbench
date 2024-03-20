/**
 * 主进程消息 on ttapp.js
 * @description 应该是接收主进程的消息
 */
const Base = require("./base");
// const appModel = require("../../model/appModel");

const useInstall = require("../ttApps/useInstall");
const useUninstall = require("../ttApps/useUninstall");

const { useSelect, useSelectAll } = require("../ttApps/useSelect");
const { BrowserWindow } = require("electron");
class TTApp extends Base {
  instances = [];

  callbacks = {};

  constructor() {
    super("ttapp");
  }
  bindIPC() {
    // 安装
    this.on("install", async (event, args) => {
      let res = await useInstall(args.zipPath);
      event.reply(args.cbId, res);
    });
    // 卸载
    this.on("uninstall", async (event, args) => {
      let res = await useUninstall(args.id);
      event.reply(args.cbId, res);
    });
    // 查询
    this.on("select", async (event, args) => {
      let res = await useSelect(args.id);
      event.reply(args.cbId, res);
    });
    // 查询所有
    this.on("selectAll", async (event, args) => {
      let res = await useSelectAll();
      event.reply(args.cbId, res);
    });
  }
}

module.exports = TTApp;
