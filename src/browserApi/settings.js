const ipcHelper = require('./ipcHelper')

function send(channel,args={}){
  ipcHelper.send('settings',channel,args)
}
async function sendSync(channel,args={}){
  return await ipcHelper.sendSync('settings',channel,args)
}
const settings={
  async get(key){
    return await sendSync('get',{key})
  },
  async set(key,value){
    return await sendSync('set', { key,value })
  }
}


module.exports=settings
