let ipc = require('electron').ipcRenderer
let contextBridge = require('electron').contextBridge
const remote = require('@electron/remote')
let FindInPage = require('electron-find').FindInPage
const tsbSdk = require('../../js/util/tsbSdk')
let tools = require('../util/util').tools
const { nanoid } = require('nanoid')
const EventIpc = require('../util/eventIpc')

const axios = require('axios')
const { config, api } = require('../../server-config')

axios.defaults.baseURL = config.NODE_SERVER_BASE_URL;
axios.defaults.adapter = require('axios/lib/adapters/http');

//todo 为了引入findinpage，关闭了sandbox，可能存在安全隐患
ipc.on('findInPage', () => {
  let findInPage = new FindInPage(remote.getCurrentWebContents())
  findInPage.openFindWindow()
})
window = tools.getWindowArgs(window)

//通过内容暴露给 window/浏览器侧sdk 一些应用信息
let sdkObject = {
  hashId: nanoid(),
  has: true,
  globalArgs: window.globalArgs,
  platform: window.platformType,
}
ipc.on('fileAssign',(event,args)=>{
  window.postMessage({
    eventName: "fileAssign",
    filePath:args.filePath})
  console.log('请求处理文件关联',args)
})

ipc.on('init', (event, args) => {
  let assignSdkObject =  Object.assign(sdkObject, args.saApp)

  tsbSdk.listener(assignSdkObject) //浏览器侧sdk挂载
  contextBridge.exposeInMainWorld('$browser', 'tsbrowser') //此处挂载上browserTag //todo 此处要考虑如何兼容不需要本地sdk的系统应用

  const eventIpc = new EventIpc(tsbSdk)

  window.addEventListener('message', function(e) {
    let eventName = e.data.eventName
    let id = e.data.id;
    let options = e.data.options
    if(!eventName) return
    if(!eventName.startsWith('third')) return
    if(e.data.hashId !== sdkObject.hashId) { throw ({code: 401, msg: '非安全的第三方应用'}) }
    switch(eventName) {
      case 'thirdHideApp':
        ipc.invoke('saAppHideApp', options).then(res => {
          tsbSdk.bridgeToWeb({eventName, resInfo: res, id})
        }).catch(err => {
          tsbSdk.bridgeToWeb({eventName: 'errorSys', errorInfo: err, id})
        })
        break;
      case 'thirdTabLinkJump':
        ipc.invoke('saAppTabLinkJump', options).then(res => {
          tsbSdk.bridgeToWeb({eventName, resInfo: res, id})
        }).catch(err => {
          tsbSdk.bridgeToWeb({eventName: 'errorSys', errorInfo: err, id})
        })
        break;
      case 'thirdNotice':
        ipc.invoke('saAppNotice', options).then(res => {
          tsbSdk.bridgeToWeb({eventName, resInfo: res, id})
        }).catch(err => {
          tsbSdk.bridgeToWeb({eventName: 'errorSys', errorInfo: err, id})
        })
        break
      case 'thirdOpenSysApp':
        ipc.invoke('saAppOpenSysApp', options).then(res => {
          tsbSdk.bridgeToWeb({eventName, resInfo: res, id})
        }).catch(err => {
          tsbSdk.bridgeToWeb({eventName: 'errorSys', errorInfo: err, id})
        })
        break
      case 'thirdOsxOpenInviteMember':
        ipc.invoke('saAppOsxOpenInviteMember', options.groupId).then(res => {
          tsbSdk.bridgeToWeb({eventName, resInfo: res, id})
        }).catch(err => {
          tsbSdk.bridgeToWeb({eventName: 'errorSys', errorInfo: err, id})
        })
        break
      case 'thirdGetUserProfile':
        ipc.invoke('saAppGetUserProfile').then(res => {
          tsbSdk.bridgeToWeb({eventName, resInfo: res, id})
        }).catch(err => {
          tsbSdk.bridgeToWeb({eventName: 'errorSys', errorInfo: err, id})
        })
        break
      case 'thirdCheckBrowserLogin':
        ipc.invoke('saAppCheckBrowserLogin').then(res => {
          tsbSdk.bridgeToWeb({eventName, resInfo: res, id})
        }).catch(err => {
          tsbSdk.bridgeToWeb({eventName: 'errorSys', errorInfo: err, id})
        })
        break
      case 'thirdApplyPermission':
        const eventReplyCallback = async (event, args) => {
          try {
            const result = await axios({
              timeout:5000,
              method: 'post',
              url: api.NODE_API_URL.ENTITY_APP.AUTO_LOGIN,
              headers: { Authorization: args.userToken },
              data: {
                client_id: args.clientId,
                bind_id: args.bindId
              }
            })
            if(result.status === 200 && result.data.code === 1000) {
              tsbSdk.bridgeToWeb({eventName, resInfo: {code: 200, msg: '成功', data: Object.assign(result.data.data, args.premissionedData.userInfo) }, id})
              console.log('yayaya进来了')
              ipc.send('closePermissionWin')
            } else {
              tsbSdk.bridgeToWeb({eventName: 'errorSys', errorInfo: {code: 500, msg: '授权登录失败'}, id})
            }
          } catch (err) {
            tsbSdk.bridgeToWeb({eventName: 'errorSys', errorInfo: {code: 500, msg: '授权登录失败'}, id})
          }
        }
        eventIpc.dispatch('saAppApplyPermission', options, eventReplyCallback, tsbSdk, id)


        // ipc.send('saAppApplyPermission', options)
        // ipc.on('selectedPermission', async (event, args) => {
        //   try {
        //     const result = await axios({
        //       timeout:5000,
        //       method: 'post',
        //       url: api.NODE_API_URL.ENTITY_APP.AUTO_LOGIN,
        //       headers: { Authorization: args.userToken },
        //       data: {
        //         client_id: args.clientId,
        //         bind_id: args.bindId
        //       }
        //     })
        //     if(result.status === 200 && result.data.code === 1000) {
        //       tsbSdk.bridgeToWeb({eventName, resInfo: {code: 200, msg: '成功', data: Object.assign(result.data.data, args.premissionedData.userInfo) }, id})
        //       ipc.send('closePermissionWin')
        //     } else {
        //       tsbSdk.bridgeToWeb({eventName: 'errorSys', errorInfo: {code: 500, msg: '授权登录失败'}, id})
        //     }
        //   } catch (err) {
        //     tsbSdk.bridgeToWeb({eventName: 'errorSys', errorInfo: {code: 500, msg: '授权登录失败'}, id})
        //   }
        // })
        break;
    }
    console.log(eventName, '无ipc的三方应用也被监听中。。。。')
  })

})
