window.ipc=require('electron').ipcRenderer
window=require('../util/util').tools.getWindowArgs(window)
const tsbApi=require('../browserApi/baseApi')
//补充的api要从这里引入，然后使用preload挂载上去
const ts={
  tsbApi:tsbApi,
  //...补充其他api
}

window.tsbApi=tsbApi


window.ts=ts
module.exports=ts
