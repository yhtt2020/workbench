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

//通过内容暴露给window一些应用信息
let sdkObject = {
  hashId: nanoid(),
  has: true,
  globalArgs: window.globalArgs,
  platform: window.platformType,
  on (name, fn) {
    if (!sdkObject[name]) {
      sdkObject[name] = []
    }
    sdkObject[name].push(fn)
  },

  emit (name, val) {
    if (sdkObject[name]) {
      sdkObject[name].map((fn) => {
        fn(val)
      })
    }
  },
  off (name, fn) {
    if (sdkObject[name]) {
      if (fn) {
        let index = sdkObject[name].indexOf(fn)
        if (index > -1) {
          sdkObject[name].splice(index, 1)
        }
      } else {
        sdkObject[name].length = 0
        //设长度为0比obj[name] = []更优，因为如果是空数组则又开辟了一个新空间，设长度为0则不必开辟新空间
      }
    }
  }
}
sdkObject.on('ready',(saApp)=>{console.log(saApp)}) //测试挂载
//contextBridge.exposeInMainWorld('tsbSDK', sdkObject) //todo 此处要考虑如何兼容不需要本地sdk的系统应用
ipc.on('fileAssign',(event,args)=>{
  window.postMessage({
    eventName: "fileAssign",
    filePath:args.filePath})
  console.log('请求处理文件关联',args)
})
ipc.on('init', (event, args) => {
  //contextBridge.exposeInMainWorld('tsbSaApp', args.saApp) //todo 此处要考虑如何兼容不需要本地sdk的系统应用
  sdkObject.emit('ready',{saApp:args.saApp}) //在此处触发sdkBoject的ready，以确保获取到

  window.addEventListener('message', function(e) {
    let messageEvent = e.data.eventName
    switch(messageEvent) {
      case 'preloadAuth':
        //todo 后面添加真正的鉴权
        //const { appId, timestamp, nonceStr, signature, jsApiList } = data.checkData
        //解密signature，sha1方法
        //校验解密出来的timestamp、nonceStr是否一致
        //然后再进一步远程ts服务器校验(jsapi_ticket, origin)是否过期，不过期返回一个true，过期返回false
        window.postMessage({
          eventName: 'preloadAuthResult',
        })
        break;
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
            window.postMessage({
              eventName: 'tsReplyGetUserProfile',
              resInfo: res
            })
          }).catch(err => {
            window.postMessage({
              eventName: 'errorSys',
              errorInfo: err
            })
          })
        } else {
          console.error('验证错误!')
        }
    }
    console.log(ipc, '无ipc的三方应用也被监听中。。。。')
  })


  tsbSdk.listener() //浏览器侧sdk
})







//todo 网页右键菜单实现
//todo 密码自动填充

// var option = {
//   title: '温馨提示',
//   body: '不要天天坐在电脑前，要早点休息！'
// };
// var myNotification = new window.Notification(option.title, option)
