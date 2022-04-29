let ipc = require('electron').ipcRenderer
let contextBridge = require('electron').contextBridge
const remote = require('@electron/remote')
let FindInPage = require('electron-find').FindInPage
const tsbSdk = require('../../js/util/tsbSdk')
let tools = require('../util/util').tools
const { nanoid } = require('nanoid')

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

tsbSdk.listener(sdkObject) //浏览器侧sdk   //todo 暂cgz个人认为下面的contextBridge.exposeInMainWorld不再需要
contextBridge.exposeInMainWorld('$browser', 'tsbrowser') //此处挂载上browserTag //todo 此处要考虑如何兼容不需要本地sdk的系统应用


//移除掉之前的ipc.on 没有意义，而且会导致页面刷新后sdk挂不上的问题

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
  }
  console.log(eventName, '无ipc的三方应用也被监听中。。。。')
})
