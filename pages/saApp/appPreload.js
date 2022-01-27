let ipc =require('electron').ipcRenderer
let contextBridge=require('electron').contextBridge
const remote=require('@electron/remote')
let FindInPage= require('electron-find').FindInPage
const tsbSdk = require('../../js/util/tsbSdk')
let tools=require('../util/util').tools
//todo 为了引入findinpage，关闭了sandbox，可能存在安全隐患
ipc.on('findInPage',()=>{
  let findInPage=new FindInPage(remote.getCurrentWebContents())
  findInPage.openFindWindow()
})
window=tools.getWindowArgs(window)
//通过内容暴露给window一些应用信息
contextBridge.exposeInMainWorld('tsbSDK', {
  has:true,
  globalArgs:window.globalArgs,
  platform:window.platformType
})
tsbSdk.listener() //浏览器侧sdk


//todo 网页右键菜单实现
//todo 密码自动填充


// var option = {
//   title: '温馨提示',
//   body: '不要天天坐在电脑前，要早点休息！'
// };
// var myNotification = new window.Notification(option.title, option)
