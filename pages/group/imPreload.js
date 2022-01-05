var electron = require('electron')
var ipc = electron.ipcRenderer
const { config } = require('../../server-config')
const xtbk = require('../../js/xtbSdk/dist/xtbSdk')

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
        if(window.localStorage.getItem('LUMNEIM-TOKEN')) {
          //浏览器已经登出，但是im还登录的情况
          window.location.href = `${host}${config.IM.AUTO_LOGIN}?removeToken=true`
        } else {
          ipc.send('message',{type:'error',config:{content: '请先完成浏览器登录!', key: Date.now()}})
        }
      }
    })
  },
}

if(href === config.IM.FRONT_URL_DEV + config.IM.AUTO_LOGIN) {
  const xtb = xtbk.default.content()
  console.log(xtb)
  xtb.OsxpcBinding()
  server.beforeInit(config.IM.FRONT_URL_DEV)
} else if(href === config.IM.FRONT_URL + config.IM.AUTO_LOGIN) {
  server.beforeInit(config.IM.FRONT_URL)
}

