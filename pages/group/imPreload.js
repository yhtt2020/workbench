var electron = require('electron')
var ipc = electron.ipcRenderer
const { config } = require('../../server-config')

window.ipc = ipc
let href = window.location.href

const server = {
  beforeInit(host) {
    //先检测node是否登录
    ipc.send('checkLogin')
    ipc.on('callback-checkLogin', (event, args) => {
      if(args) {
        if(window.localStorage.getItem('LUMNEIM-TOKEN')) {
          return
        } else {
          ipc.send('imAutoLogin')
          ipc.on('callback-imAutoLogin', (event, args) => {
            if(args.code === 1000) {
              window.location.href = `${host}${config.IM.AUTO_LOGIN}?code=${args.data.code}`
            }
          })
        }
      } else {
        ipc.send('message',{type:'error',config:{content: '请先完成浏览器登录!', key: Date.now()}})
        return
      }
    })
  },
}

if(href === config.IM.FRONT_URL_DEV + config.IM.AUTO_LOGIN) {
  server.beforeInit(config.IM.FRONT_URL_DEV)
} else if(href === config.IM.FRONT_URL + config.IM.AUTO_LOGIN) {
  server.beforeInit(config.IM.FRONT_URL)
}

