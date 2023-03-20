const ipcHelper = require('../browserApi/ipcHelper')

function send(channel,args={}){
  ipcHelper.send('watch',channel,args)
}
async function sendSync(channel,args={}){
  return await ipcHelper.sendSync('watch',channel,args)
}
const watch={
  async addTask(task){
    return await sendSync('addTask', { task })
  },
}


module.exports=watch
