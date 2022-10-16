const {
  ipcRenderer:ipc
} = require('electron')
const ipcHelper={
  send(module,channel,args){
    args['_name']=window.baseApi.runtime.name
    ipc.send('api.'+module+'.'+channel,args)
  },
  async sendSync(module,channel,args){
    args['_name']=window.baseApi.runtime.name
    return await ipc.sendSync('api.'+module+'.'+channel,args)
  }
}


module.exports=ipcHelper
