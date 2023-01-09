const {
  ipcRenderer:ipc
} = require('electron')
const ipcHelper={
  send(module,channel,args,_name){
    ipc.send('api.'+module+'.'+channel,this._getArgs(args,_name))
  },
  async sendSync(module,channel,args,_name){
    return await ipc.sendSync('api.'+module+'.'+channel,this._getArgs(args,_name))
  },
  /**
   * 封装一下参数，夹带上一些额外的参数
   * @param args
   * @param _name
   * @returns {{args: *}}
   */
  _getArgs(args,_name){
    let sendArgs={
      'args':args
    }
    sendArgs['_name']=_name?_name:window.baseApi.runtime.name
    return sendArgs
  }
}


module.exports=ipcHelper
