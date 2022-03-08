const electron = eval('require')('electron')
const ipcSender = electron.ipcRenderer

const ipc = {
  openExternal(fullPath){
    ipcSender.send('openExternal', { fullPath })
  },
  /**
   * 打开目录
   * @param dir
   */
  openDir (dir) {
    ipcSender.send('openDir', { dir })
    console.log('我欲打开dir', { dir })
  },
  showItemInFolder (fullPath) {
    ipcSender.send('showItemInFolder', { fullPath })
  },
  handleFileAssign (type,args) {
    ipcSender.send('handleFileAssign', { type: type, args: { filePath: args.filePath } })
  },
  setWallPaper(wallPaper){
    ipcSender.send('setWallPaper',{wallPaper:wallPaper})
  }
}

export default ipc
