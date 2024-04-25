window.ipc=require('electron').ipcRenderer
window=require('../util/util').tools.getWindowArgs(window)
const tsbApi=require('../browserApi/baseApi')
const tableApi=require('../tableApi/baseApi')
//补充的api要从这里引入，然后使用preload挂载上去
const tt={
  bs:tsbApi,
  tb:tableApi
  //...补充其他api
}
window.tb=tableApi
window.bs=tsbApi

console.log('初始化tsApi')
window.tt=tt
module.exports=tt
