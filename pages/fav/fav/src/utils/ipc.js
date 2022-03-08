const electron = eval('require')('electron')
const ipcSender = electron.ipcRenderer

const ipc = {
  /**
   * 打开目录
   * @param dir
   */
  openDir (dir) {
    ipcSender.send('openDir', { dir })
    console.log('我欲打开dir',{dir})
  }
}

export default ipc
