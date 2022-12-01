const { contextBridge } = require('electron')

function tipOpenInApp (params) {
  // {
  //   appId:'',//应用市场id
  //     title:'安装提醒',
  //   content:'是否安装此应用，并用应用模式打开？'
  // }
  ipc.send('executeAppByPackage', { package: 'com.thisky.com' })
}

function installAppConfirm () {

}

function openApp () {
  ipc.send('executeAppByPackage', { package: 'com.thisky.com' })
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
  openApp
})
