/**
 * 主进程回调 ttapp.js
 */
const ipcHelper = require("./ipcHelper");

function send(channel, args = {}) {
  ipcHelper.send("ttapp", channel, args);
}
async function sendSync(channel, args = {}) {
  return await ipcHelper.sendSync("ttapp", channel, args);
}
const ttapp = {
  installV2(options, cb) {
    console.log("installV2 send :>> ", options, cb);
    let cbId = require("nanoid").nanoid();
    ipc.once(cbId, (event, args) => {
      console.log('args :>> ', args);
      cb?.(args);
    });
    return send("installV2", {
      options,
      cbId,
    });
  },
  renew(id, cb) {
    let cbId = require("nanoid").nanoid();
    ipc.once(cbId, (event, args) => {
      cb?.(args);
    });
    return send("renew", {
      id,
      cbId,
    });
  },
  // installJson(data, cb) {
  //   let cbId = require("nanoid").nanoid();
  //   ipc.once(cbId, (event, args) => {
  //     cb?.(args);
  //   });
  //   return send("installJson", {
  //     data,
  //     cbId,
  //   });
  // },
  // checkFile(path, cb) {
  //   let cbId = require("nanoid").nanoid();
  //   ipc.once(cbId, (event, args) => {
  //     cb?.(args);
  //   });
  //   return send("checkFile", {
  //     path,
  //     cbId,
  //   });
  // },
  uninstall(id, cb) {
    let cbId = require("nanoid").nanoid();
    ipc.once(cbId, (event, args) => {
      cb?.(args);
    });
    return send("uninstall", {
      id,
      cbId,
    });
  },
  select(id, cb) {
    let cbId = require("nanoid").nanoid();
    ipc.once(cbId, (event, args) => {
      cb?.(args);
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
      cb?.(args);
    });
    return send("selectAll", {
      cbId,
    });
  },
};

module.exports = ttapp;
