const ipcHelper=require('./ipcHelper')

const notification={
  async send(options){
    await ipcHelper.sendSync('notification','send',{options})
  }
}




module.exports=notification
