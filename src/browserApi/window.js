const {
  ipcRenderer
} = require('electron')
const ipc = ipcRenderer
const windowApi = {
  close: () => {
    ipc.send('closeBarrageWindow')
  }
}
module.exports=windowApi
