/**
 * ttapp.js
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
      if (cb) {
        console.log("安装回调", args);
        cb(args);
      }
    });
    return send("install", {
      zipPath,
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
  selectAll(id, cb) {
    let cbId = require("nanoid").nanoid();
    ipc.once(cbId, (event, args) => {
      cb && cb(args);
    });
    return send("selectAll", {
      id,
      cbId,
    });
  },
};

module.exports = ttapp;
