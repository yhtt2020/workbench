window.ipc=require('electron').ipcRenderer
window=require('../util/util').tools.getWindowArgs(window)
const tsbApi=require('../browserApi/baseApi')
const tableApi=require('../tableApi/baseApi')
//补充的api要从这里引入，然后使用preload挂载上去
const ts={
  tsbApi:tsbApi,
  tableApi:tableApi
  //...补充其他api
}

window.tsbApi=tsbApi
window.tableApi=tableApi

window.ts=ts
module.exports=ts
