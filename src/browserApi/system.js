const ipcHelper = require('./ipcHelper')

function send (channel, args = {},cb) {
  ipcHelper.sendWithCb('system', channel, args,cb)
}

const system = {
  setPaper (url) {
    ipc.send('downloadAndSetWallpaper', { url: url })
  },
  setLocalPaper(uri){
    ipcHelper.send('system', 'setLocalPaper', { uri: uri })
  },

  /**
   * 提取文件的图标
   * @param uri
   * @returns {Promise<any>}
   */
  async extractFileIcon (uri) {
    return await ipcHelper.sendSync('system', 'extractFileIcon', { uri: uri })
  },
  /**
   * 获取快捷方式的真实地址
   * @param uri 支持.lnk
   * @returns {Promise<any|string>}
   */
  async getRealPath (uri) {
    if (uri.endsWith('.lnk')) {
      let urlFile = require('electron').shell.readShortcutLink(uri)
      return urlFile.target
    }
    return await ipcHelper.sendSync('system', 'getRealPath', { uri: uri })
  },
  /**
   * 完全异步获取浏览器的书签，需要通过cb来回调
   * @param browser chrome,edge,safari（暂不支持）
   * @param cb 回调,cb(bookmarks[])
   */
  getBrowserBookmark (browser='chrome', cb) {
    send('getBookmarks',{
      browser
    },cb)

  },
  restart(){
    send('restart')
  },
  setDarkMode(darkMode){
    send('setDarkMode',{
      mode:darkMode
    })
  },
  async isDarkMode(){
    return ipcHelper.sendSync('system', 'isDarkMode')
  },

  async shouldUseDarkMode(){
    return ipcHelper.sendSync('system', 'shouldUseDarkMode')
  }
}
module.exports = system
