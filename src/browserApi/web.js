const ipcHelper = require('./ipcHelper')

const {
  ipcRenderer
} = require('electron')
const ipc = ipcRenderer

function send (channel, args = {}) {
  ipcHelper.send('web', channel, args)
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
        console.log('接收到了消息回调',a)
        callback(a)
      })
    }
    delete options.callback
    send('openPreloadWindow', {
      ...options,
      cbId: cbId
    })
  },
}

module.exports = web
