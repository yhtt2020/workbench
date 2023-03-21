window.ipc=require('electron').ipcRenderer
window=require('../util/util').tools.getWindowArgs(window)
//补充的api要从这里引入，然后使用preload挂载上去
const baseApi={
  runtime:require('./runtime.js'),
  watch:require('./watch.js'),//监控API
}
window.baseApi=baseApi
module.exports=baseApi
