const ipcHelper = require('./ipcHelper')

function send(channel,args={}){
  ipcHelper.send('app',channel,args)
}
function sendSync(channel,args={}){
  return ipcHelper.sendSync('app',channel,args)
}
const app={
   getAll:async()=>{
    return sendSync('getAll')
  },
  /**
   *
   * @param nanoid
   * @param background
   * @param app
   * @param args
   */
  run:(nanoid,background,app,args)=>{
     return send('run',{
       nanoid:nanoid,
       background:background,
       app:app,
       args:args
     })
  },
  /**
   *
   * @param pkg 包名
   * @param background
   * @param app
   * @param option
   */
  runByPackage:(pkg,background,option)=>{
    return send('runByPackage',{
      pkg:pkg,
      background:background,
      option:option
    })
  },
  /**
   * 安装指定应用1
   * @param manifest 安装应用的manifest
   * @param cb  回调
   */
  installAppConfirm(manifest,cb){
    let cbId=require('nanoid').nanoid()
    ipc.once(cbId,(event,args)=>{
      if(cb){
        console.log('安装回调',args)
        cb(args)
      }
    })
    return send('installAppConfirm',{
      manifest:manifest,
      cbId:cbId
    })
  },
  installTTApp(zipPath,cb){
    let cbId=require('nanoid').nanoid()
    ipc.once(cbId,(event,args)=>{
      if(cb){
        console.log('安装回调',args)
        cb(args)
      }
    })
    return send('installTTApp',{
      manifest:zipPath,
      cbId:cbId
    })
  }
}

module.exports=app
