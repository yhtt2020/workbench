var electron = require('electron')
var ipc = electron.ipcRenderer
const { config } = require('../../server-config')
const tsbSdk = require('../../js/util/tsbSdk')

window.ipc = ipc
window.$browser = 'tsbrowser'
window.isApp=true
window.tsbSdk=tsbSdk
let href = window.location.href
ipc.on('gotUserInfo',(event,args)=>{
  tsbSdk.send('gotUserInfo',args)//收到侧边栏发来的用户信息，并传消息给应用主界面
})
window.appReady=function(){
  ipc.send('getUserInfo')
  ipc.send('favInit')
}

ipc.on('addPage',()=>{
  window.addPageCallback()
})//挂载添加页面到收藏夹的回调，去调取回传数据的方法，这个方法来自于添加页面的mounted挂载
