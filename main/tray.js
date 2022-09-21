const { Tray } = require('electron')
const baseApi = require('./src/api/baseApi.js')
var osu=require('node-os-utils')
// const {require} = require("@electron/remote");
// var viewMap = require('viewManager.js')


function sendIPCToTrayWindow (action, data) {
  // if there are no windows, create a new one
  if (trayWindow === null) {
   return
  } else {
    trayWindow.webContents.send(action, data || {})
  }
}

async function getUserInfo() {
  await baseApi.init()
  return  baseApi.axios('/app/getUserInfo', {fields: 'fans,follow,grade,post_count,signature,nickname,avatar'}, 'get')
}

let trayWindow=null
function getTrayWindow(){
  if(trayWindow===null){
    createTrayWin()
  }
  return trayWindow
}

async function getMemory() {
  let mem = await osu.mem.info()
  let info = {
    mem: mem,
  }
  return info
}

function createTrayWin () {
  trayWindow = new BrowserWindow({
    frame: false,
    width: 400,
    height: 410,
    sandbox: false,
    // disableDialogs:true,
    resizable: false,
    autoHideMenuBar: true,
    show: false,
    focusable: true,
    acceptFirstMouse: true,
    transparent:true,
    backgroundColor: '#00000000',
    maximizable: false,
    skipTaskbar:true,
    alwaysOnTop: false,//调整窗口层级
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  })
  trayWindow.webContents.loadURL(getUrl('tray.html'))
  trayWindow.on('ready-to-show',()=>{
    trayWindow.show()
  })
  trayWindow.on('blur',()=>{
    // trayWindow.close()
    // trayWindow=null
  })
}
function getUrl (url) {
  let protocolUrl
  protocolUrl = `tsbapp://./${url}` //todo 需要验证正式环境的协议情况
  if (isDevelopmentMode) {
    protocolUrl = `http://localhost:1600/${url}`
  }
  return protocolUrl
}

let tray=null
app.whenReady().then(() => {
  ipc.on('getMemory',(event,args)=> {
    var obj = Object.keys(viewMap);
    var pageCount = obj.map(key => viewMap[key]).length
    var appCount = appManager.saApps.length
    getMemory().then(info => {
      let data = {
        mem: info,
        pageCount: pageCount,
        appCount: appCount
      }
      event.reply('getMemory', data)
    })
  })
  ipc.on('getUserInfo',(event,args)=>{
    getUserInfo().then(r => {
      sendIPCToTrayWindow('userInfo',r.data)
    })
  })

  if(process.platform==='darwin'){
    tray = new Tray(path.join(__dirname,'/icons/tray/mac/tray.png'))
  }else{
    tray = new Tray(path.join(__dirname,'/icons/tray/win/tray.png'))
  }
  tray.setToolTip("想天浏览器")
  tray.on('click', function(event,position) {
    getTrayWindow()
    trayWindow.setPosition(position.x - 350,position.y - 580)
    return false
    // pool.usePop({
    //   url: render.getUrl('tray.html'),
    //   width: 400,
    //   height: 600,
    //   x: position.x - 350,
    //   y: position.y - 600,
    // }).then( r =>{
    //
    // })
  })
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '打开主界面',
      click: () => {
        if(!mainWindow){
          createWindow()
        }else{
          mainWindow.show()
        }
      }
    },
    {
      label: '切换账号空间',
      click: () => {
        showUserWindow()
      }
    },
    {
      label: '全局搜索',
      click: () => {
        globalSearchMod.init()
        //statsh 点击打开全局搜索
        if(globalSearch && globalSearch.isFocused()) {
          statsh.do({
            action: 'increase',
            key: 'globalSearchBaseClickOpen',
            value: 1
          })
        }
      }
    },
    {
      label: '关闭浏览器',
    },
  ])
  tray.on('right-click',()=>{
    tray.popUpContextMenu(contextMenu)
  })
})
