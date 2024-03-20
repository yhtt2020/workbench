/**
 * 主进程回调 ipcHelper ttapp.js
 * @description 应该是主进程的回调处理
 */
const ipcHelper = require("./ipcHelper");

function send(channel, args = {}) {
  ipcHelper.send("ttapp", channel, args);
}
async function sendSync(channel, args = {}) {
  return await ipcHelper.sendSync("ttapp", channel, args);
}
const ttapp = {
  install(zipPath, cb) {
    let cbId = require("nanoid").nanoid();
    ipc.once(cbId, (event, args) => {
      cb && cb(args);
    });
    return send("install", {
      zipPath,
      cbId,
    });
  },
  writeJson(id, data, cb) {
    let cbId = require("nanoid").nanoid();
    ipc.once(cbId, (event, args) => {
      cb && cb(args);
    });
    return send("writeJson", {
      id,
      data,
      cbId,
    });
  },
  uninstall(id, cb) {
    let cbId = require("nanoid").nanoid();
    ipc.once(cbId, (event, args) => {
      cb && cb(args);
    });
    return send("uninstall", {
      id,
      cbId,
    });
  },
  select(id, cb) {
    let cbId = require("nanoid").nanoid();
    ipc.once(cbId, (event, args) => {
      cb && cb(args);
    });
    return send("select", {
      id,
      cbId,
    });
  },
  selectAll(cb) {
    let cbId = require("nanoid").nanoid();
    ipc.once(cbId, (event, args) => {
      console.log("args :>> ", args);
      cb && cb(args);
    });
    return send("selectAll", {
      cbId,
    });
  },
};

module.exports = ttapp;
