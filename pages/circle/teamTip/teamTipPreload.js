var electron = require('electron')
var ipc = electron.ipcRenderer
const tsbSdk = require('../../../js/util/tsbSdk.js')

localStorage.setItem('TSB_SAAPP', JSON.stringify({
  isSystemApp: true
}))

tsbSdk.listener()
