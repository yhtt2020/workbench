const {
  ipcRenderer
} = require('electron')
const ipc = ipcRenderer
const tabs={
  async current(){
    return await ipc.sendSync('tabs.current')
  }
}

module.exports=tabs
