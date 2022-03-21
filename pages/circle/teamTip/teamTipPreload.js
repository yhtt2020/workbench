var electron = require('electron')
var ipc = electron.ipcRenderer
const tsbSdk = require('../../../js/util/tsbSdk.js')

localStorage.setItem('tsbSaApp', JSON.stringify({
  isSystemApp: true
}))

tsbSdk.listener()
