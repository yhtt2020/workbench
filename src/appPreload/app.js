let $ = require('cash-dom')
let fs = require('fs')
let ipc = require('electron').ipcRenderer
let util = require('../util/util')
let t = util.tools.getWindowArgs(window)

module.exports={
  $,
  fs,
  ipc,
  util,
  args:window.globalArgs
}
