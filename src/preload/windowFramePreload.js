window.windowId = 0
window.nanoid = ''
require('../../dist/localization.build.js')
window.ipc = require('electron').ipcRenderer

window.clipboard=require('electron').clipboard
