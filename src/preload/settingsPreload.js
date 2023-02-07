let systemInfo = {}
let ipc = require('electron').ipcRenderer

//载入本地化的语言包方法
const { l, userLanguage, getCurrentLanguage, init } = require('./../../dist/localization.build.js')
window.l = l
window.userLanguage = userLanguage
window.getCurrentLanguage = getCurrentLanguage
window.localeInit = init
window.$models = {
  logger: require('../util/logger')
}

window.addEventListener('message', function (e) {
  console.log(e,'收到消息')
  if (e.data && e.data.message && e.data.message === 'getSettingsData') {
    ipc.send('getSettingsData')
  }

  if (e.data && e.data.message && e.data.message === 'setSetting') {
    ipc.send('setSetting', { key: e.data.key, value: e.data.value })
  }

  //唤起主进程设置默认浏览器的请求，由于设置是异步的，这里只发起请求即可
  if (e.data.message === 'callSetOrRemoveDefaultBrowser') {
    ipc.send('callSetOrRemoveDefaultBrowser', { systemInfo: systemInfo })
  }

  //询问主进程，是否是默认浏览器
  if (e.data.message === 'getIsDefaultBrowser') {
    ipc.send('getIsDefaultBrowser')
  }

  if (e.data.message === 'themeChange') {
    ipc.send('themeChange', { status: e.data.status })
  }

})

ipc.on('returnIsDefaultBrowser', function (e, data) {
  window.postMessage({ message: 'returnIsDefaultBrowser', result: data })
})

ipc.on('receiveSettingsData', function (e, data) {
  console.log('收到bao')
  systemInfo = data.systemInfo
  window.postMessage({ message: 'receiveSettingsData', settings: data })
})
ipc.on('setBrowserReturn', (e, args) => {
  //console.log(args)
})

window.ipc = ipc
