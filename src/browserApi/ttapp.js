
const ipcHelper=require('./ipcHelper')

function send(channel,args={}){
  ipcHelper.send('ttapp',channel,args)
}
async function sendSync(channel,args={}){
  return await ipcHelper.sendSync('ttapp',channel,args)
}
//
const ttapp = {
  install(zipPath,cb){
    let cbId=require('nanoid').nanoid()
    ipc.once(cbId,(event,args)=>{
      if(cb){
        console.log('安装回调',args)
        cb(args)
      }
    })
    return send('install',{
     zipPath,
      cbId:cbId
    })
  }
}



module.exports=ttapp
