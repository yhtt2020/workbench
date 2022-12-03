const { contextBridge } = require('electron')

function tipOpenInApp (params) {
  // {
  //   appId:'',//应用市场id
  //     title:'安装提醒',
  //   content:'是否安装此应用，并用应用模式打开？'
  // }
  // window.location.href=`tsb://app/redirect/?package=com.thisky.appStore&url=${params}`
  ipc.send('openAppStore', params)
}

function installAppConfirm (e) {
  ipc.send('installAppConfirm',e)
}

function openGroupChat (e) {
  ipc.send('openAppGroupChat',e)
}

let browser = {
  name: 'ThiskyBrowser',
  alias: '想天浏览器',
  version: '3.4.1',
  short: 'tsb',
}

contextBridge.exposeInMainWorld('__TSB_RUNTIME', browser)
contextBridge.exposeInMainWorld('__TSB_API', {
  tipOpenInApp,
  installAppConfirm,
  openGroupChat
})
