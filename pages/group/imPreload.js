var electron = require('electron')
var ipc = electron.ipcRenderer
const { config } = require('../../server-config')
const tsbSdk = require('../../js/util/tsbSdk')

window.ipc = ipc
window.$browser = 'tsbrowser'

let href = window.location.href

let isDevelopmentMode = process.argv.some(arg=>arg==='--development-mode')

const server = {
  beforeInit(host) {
    //先检测node是否登录
    ipc.send('checkLogin')
    ipc.on('callback-checkLogin', (event, args) => {
      if(args) {
        ipc.send('imAutoLogin')
        ipc.on('callback-imAutoLogin', (event, args) => {
          if(args.code === 1000) {
            window.location.href = `${host}${config.IM.AUTO_LOGIN}?code=${args.data.code}`
          } else {
            ipc.send('message',{type:'error',config:{content: args.message, key: Date.now()}})
          }
        })
      } else {
        //浏览器未登录，lumen跳到一个引导页且实现登出，里面布局一个按钮，sdk触发免登的跳转
        ipc.send('message',{type:'error',config:{content: '请先登录浏览器!', key: Date.now()}})
        window.location.href = `${host}${config.IM.BOOT_ROUTE}?removeToken=true`
      }
    })
  },
}

ipc.invoke('imPreloadReady').then((args) => {
  localStorage.setItem('tsbSaApp', JSON.stringify(args))
  //定制好订阅器
  let DepList = []
  DepList.push({
    func: server.beforeInit,
    host: isDevelopmentMode ? config.IM.FRONT_URL_DEV : config.IM.FRONT_URL
  })
  tsbSdk.listener(DepList)

  if(href === config.IM.FRONT_URL_DEV + config.IM.AUTO_LOGIN) {
    server.beforeInit(config.IM.FRONT_URL_DEV)
  } else if (href === config.IM.FRONT_URL + config.IM.AUTO_LOGIN) {
    server.beforeInit(config.IM.FRONT_URL)
  }
})

ipc.on('imLogout', () => {
  let host = isDevelopmentMode ? config.IM.FRONT_URL_DEV : config.IM.FRONT_URL
  window.location.href = `${host}${config.IM.BOOT_ROUTE}?removeToken=true`
})

ipc.on('switchChat', (event, args) => {
  window.$instance.$children[0].$children[0].clickTab(args)
})

ipc.on('reloadGroup', () => {
  window.location.reload()
})
