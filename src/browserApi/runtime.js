
const clientModel = require('../model/clientModel')
const ipcHelper=require('./ipcHelper')
function send(channel,args={}){
  ipcHelper.send('runtime',channel,args,runtime.name)
}
let runtime={
  name:window.globalArgs['name'],
  version:{
    'api':'1.0.0',
    'barrage':'1.0.0',
    'tabs':'1.0.0',
    'user':'1.0.0',
    'window':'1.0.0'
  },
  client:{
    id:'',
    name:''
  },
  initialize(){
    runtime.client=clientModel.get()
    runtime.clientId=runtime.client.id  //兼容老版本，仍然提供这个变量
    runtime.clientName=runtime.client.name //兼容老版本，仍然提供这个变量


    ipc.on('api.runtime.initResponse',(event,args)=>{
      tsbApi.runtime.info=args.runtime//获取到当前窗口的状态存储下来
    })
    send('init')
  },
}

runtime.initialize()
module.exports=runtime
