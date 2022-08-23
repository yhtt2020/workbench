const path = eval('require')('path')
const fs = eval('require')('fs')
const {
  contextBridge, ipcRenderer
} = require('electron')
const ipc = ipcRenderer
const window = {
  close: () => {
    ipc.send('closeBarrageWindow')
    console.log('发送closeBarrageWindow')
  }
}
contextBridge.exposeInMainWorld('tsbApi', {
  path,
  fs,
  ipc: ipcRenderer,
  window
})
