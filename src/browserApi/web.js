const ipcHelper = require('./ipcHelper')

const {
  ipcRenderer
} = require('electron')
const ipc = ipcRenderer

function send (channel, args = {},cb) {
  ipcHelper.sendWithCb('web', channel, args,cb)
}

async function sendSync (channel, args = {}) {
  return await ipcHelper.sendSync('web', channel, args)
}

const web = {
  async openPreloadWindow (options) {
    let callback=options.callback
    if (callback) {
      var cbId = 'callback_' + require('nanoid').nanoid(8)
      ipc.once(cbId, (e, a) => {
        callback(a)
      })
    }
    delete options.callback
    send('openPreloadWindow', {
      ...options,
      cbId: cbId
    })
  },
  async getCacheSize(cb){
    send('getCacheSize',{},(data)=>{
      cb(data)
    })
  },
  async clearCache(cb){
    send('clearCache',{},(data)=>{
      cb(data)
    })
  },
  async getWebCacheSize(cb){
    send('getWebCacheSize',{},(data)=>{
      cb(data)
    })
  },
  async clearWebCache(cb){
    send('clearWebCache',{},(data)=>{
      cb(data)
    })
  }
}

module.exports = web
