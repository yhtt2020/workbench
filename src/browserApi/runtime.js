
const clientModel = require('../model/clientModel')

const runtime={
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
  }
}

runtime.initialize()
module.exports=runtime
