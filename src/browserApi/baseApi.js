window.ipc=require('electron').ipcRenderer
window=require('../util/util').tools.getWindowArgs(window)
//补充的api要从这里引入，然后使用preload挂载上去
const baseApi={
  window:require('./window.js'),
  user:require('./user.js'),
  barrage:require('./barrage.js'),
  tabs:require('./tabs.js'),
  runtime:require('./runtime.js'),
  util:require('./util.js')
}
window.baseApi=baseApi
module.exports=baseApi
