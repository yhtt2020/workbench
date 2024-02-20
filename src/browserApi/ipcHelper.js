const {
  ipcRenderer: ipc
} = require('electron')
const { nanoid } = require('nanoid')
const ipcHelper = {
  send (module, channel, args, _name) {
    ipc.send('api.' + module + '.' + channel, this._getArgs(args, _name))
  },
  async sendSync (module, channel, args, _name) {
    return await ipc.sendSync('api.' + module + '.' + channel, this._getArgs(args, _name))
  },
  /**
   * 封装一下参数，夹带上一些额外的参数
   * @param args
   * @param _name
   * @returns {{args: *}}
   */
  _getArgs (args, _name) {
    let sendArgs = {
      'args': args
    }
    sendArgs['_name'] = _name ? _name : window.baseApi.runtime.name
    return sendArgs
  },

  bindCb (cb) {
    const { nanoid } = require('nanoid')
    let cbId = nanoid()
    ipc.once(cbId, (e, a) => {
      cb(a)
    })
    return cbId
  },
  sendWithCb (module, channel, args, cb=undefined) {
    if(cb){
      ipcHelper.send(module, channel, {
        ...args,
        cbId: ipcHelper.bindCb(cb)
      })
    }else{
      ipcHelper.send(module, channel, args)
    }

  }
}

module.exports = ipcHelper
