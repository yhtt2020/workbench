
const ipcHelper=require('../browserApi/ipcHelper')
function send(channel,args={}){
  ipcHelper.send('runtime',channel,args,runtime.name)
}
let runtime={
  name:window.globalArgs['name'],
  type:window.globalArgs['app-type']||'qing',//增加对轻应用，桌面应用的判断
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
  },
}

runtime.initialize()
module.exports=runtime
