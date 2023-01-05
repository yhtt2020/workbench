const ipcHelper = require('./ipcHelper')

function send(channel,args={}){
  ipcHelper.send('screen',channel,args)
}
async function sendSync(channel,args={}){
  return await ipcHelper.sendSync('screen',channel,args)
}

const screen={
  async getAllDisplays (){
    return await  sendSync('getAllDisplays')
  }
}

module.exports=screen
