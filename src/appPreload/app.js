let $ = require('cash-dom')
let fs = require('fs')
let ipc = require('electron').ipcRenderer
let util = require('../util/util')
let t = util.tools.getWindowArgs(window)
function clearText (text) {
  return text.replaceAll('\n', '').replaceAll(' ', '').replaceAll('\t', '')
}

function fixProtocol (url) {
  return window.location.protocol + url
}

function intervalEvent(event,ms=200){
  let timer=setInterval(()=>{
    function clear(){
      clearInterval(timer)
    }
    event(clear)
  },ms)
}
function callback(data){
  ipc.send('api.web.callback', {
    args: {
      cbId: window.globalArgs['cbId'],
      ...data
    }
  })
}


module.exports={
  $,
  fs,
  ipc,
  util,
  args:window.globalArgs,
  clearText,
  fixProtocol,
  intervalEvent,
  closeSelf:()=>{
    ipc.send('closeSelf')
  },
  callback

}
