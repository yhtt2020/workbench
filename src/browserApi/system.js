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
  }
}
module.exports=system
