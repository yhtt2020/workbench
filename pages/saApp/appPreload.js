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
//contextBridge.exposeInMainWorld('tsbSaApp', sdkObject) //todo 此处要考虑如何兼容不需要本地sdk的系统应用


//移除掉之前的ipc.on 没有意义，而且会导致页面刷新后sdk挂不上的问题

window.addEventListener('message', function(e) {
  let messageEvent = e.data.eventName
  let id = e.data.id;
  switch(messageEvent) {
    case 'saAppHide':
      if(e.data.hashId === sdkObject.hashId) {
        ipc.send('sdkHideApp', {appId: e.data.saApp.id})
      } else {
        console.error('验证错误！')
      }
      break;
    case 'saAppTabNavigate':
      if(e.data.hashId === sdkObject.hashId) {
        ipc.send('addTab', { 'url': e.data.options.url })
      } else {
        console.error('验证错误！')
      }
      break;
    case 'thirdSaAppNotice':
      if(e.data.hashId === sdkObject.hashId) {
        ipc.send('saAppNotice', {options: e.data.options, saAppId: e.data.saApp.id})
      } else {
        console.error('验证错误！')
      }
      break
    case 'thirdSaAppOpen':
      if(e.data.hashId === sdkObject.hashId) {
        ipc.send("saAppOpen", { options: e.data.options, saAppId: e.data.saApp.id });
      } else {
        console.error('验证错误！')
      }
      break
    case 'thirdGetUserProfile':
      if(e.data.hashId === sdkObject.hashId) {
        ipc.invoke('saAppGetUserProfile').then(res => {
          console.log(res, '^^^^^^^^^^^^^^^')
          window.postMessage({
            eventName: 'tsReplyGetUserProfile',
            resInfo: res,
            id
          })
        }).catch(err => {
          window.postMessage({
            eventName: 'errorSys',
            errorInfo: err,
            id
          })
        })
      } else {
        console.error('验证错误!')
      }
  }
  console.log(ipc, '无ipc的三方应用也被监听中。。。。')
})
