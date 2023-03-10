const ipcHelper = require('./ipcHelper')

function send(channel,args={}){
  ipcHelper.send('dialog',channel,args)
}
async function sendSync(channel,args={}){
  return await ipcHelper.sendSync('dialog',channel,args)
}

const dialog={
  async showOpenDialog (options){
    return await  sendSync('showOpenDialog',options)
  },
  async showSaveDialog (options){
    return await  sendSync('showSaveDialog',options)
  },
  async showMessageBox (options){
    return await  sendSync('showMessageBox',options)
  },
  async showErrorBox (options){
    return await  sendSync('showErrorBox',options)
  }
}

module.exports=dialog
