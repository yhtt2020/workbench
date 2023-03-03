window.ipc=require('electron').ipcRenderer
window=require('../util/util').tools.getWindowArgs(window)
//补充的api要从这里引入，然后使用preload挂载上去
const baseApi={
  window:require('./window.js'),//窗口接口
  user:require('./user.js'),//用户接口
  barrage:require('./barrage.js'),//弹幕接口
  tabs:require('./tabs.js'),//浏览器tab接口
  runtime:require('./runtime.js'),//运行环境
  util:require('./util.js'),//小工具
  notification:require('./notification.js'),//通知接口
  screen:require('./screen.js'),//屏幕接口
  dialog:require('./dialog.js'),//对话框接口
  download:require('./download.js'),//下载接口
  system:require('./system.js')//系统接口
}
window.baseApi=baseApi
module.exports=baseApi
