const ipcHelper = require('./ipcHelper')

function send(channel,args={}){
  ipcHelper.send('system',channel,args)
}
const system={
  setPaper(url){
    ipc.send('downloadAndSetWallpaper',{url:url})
  },
  async extractFileIcon(uri){
    return await  ipcHelper.sendSync('system','extractFileIcon',{uri:uri})
  },
  async getRealPath(uri){
    if (uri.endsWith('.lnk')) {
      let urlFile = require('electron').shell.readShortcutLink(uri)
      return urlFile.target
    }
    return await  ipcHelper.sendSync('system','getRealPath',{uri:uri})
  }
}
module.exports=system
