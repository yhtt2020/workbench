var electron = require('electron')
var ipc = electron.ipcRenderer
const tsbSdk = require('../../../js/util/tsbSdk.js')

tsbSdk.listener({isSystemApp: true})
