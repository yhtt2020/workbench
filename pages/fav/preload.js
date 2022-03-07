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
  tsbSdk.send('gotUserInfo',args)
  console.log('收到，并回发消息',args)
})
window.appReady=function(){
  ipc.send('getUserInfo')
}
