let ipc = require('electron').ipcRenderer
let contextBridge = require('electron').contextBridge
const remote = require('@electron/remote')
let FindInPage = require('electron-find').FindInPage
const tsbSdk = require('../../js/util/tsbSdk')
let tools = require('../util/util').tools
//todo 为了引入findinpage，关闭了sandbox，可能存在安全隐患
ipc.on('findInPage', () => {
  let findInPage = new FindInPage(remote.getCurrentWebContents())
  findInPage.openFindWindow()
})
window = tools.getWindowArgs(window)

//通过内容暴露给window一些应用信息
let sdkObject = {
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
sdkObject.on('ready',(saApp)=>{console.log(saApp)}) //测试挂载
contextBridge.exposeInMainWorld('tsbSDK', sdkObject)
tsbSdk.listener() //浏览器侧sdk

ipc.on('init', (event, args) => {
  contextBridge.exposeInMainWorld('tsbSaApp', args.saApp)
  sdkObject.emit('ready',{saAPP:args.saApp}) //在此处触发sdkBoject的ready，以确保获取到
})

//todo 网页右键菜单实现
//todo 密码自动填充

// var option = {
//   title: '温馨提示',
//   body: '不要天天坐在电脑前，要早点休息！'
// };
// var myNotification = new window.Notification(option.title, option)
