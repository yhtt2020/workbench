window.ipc=require('electron').ipcRenderer
const settings = require('../../js/util/settings/settings.js')

const runtime={
  version:{
    'api':'1.0.0',
    'barrage':'1.0.0',
    'tabs':'1.0.0',
    'user':'1.0.0',
    'window':'1.0.0'
  },
  clientId:'',
  clientName:'',
}
runtime.clientId= settings.get('clientID')
runtime.clientName=settings.get('clientName')
if(!runtime.clientName){
  runtime.clientName=require('os').hostname()
}
module.exports=runtime
