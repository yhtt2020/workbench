const { Tray } = require('electron')
const baseApi = require('./src/api/baseApi.js')
var osu=require('node-os-utils')
// const {require} = require("@electron/remote");
// var viewMap = require('viewManager.js')


function sendIPCToTrayWindow (action, data) {
  // if there are no windows, create a new one
  if (TrayWindow === null) {
    getTrayWindow(function () {
      TrayWindow.webContents.send(action, data || {})
    })
  } else {
    TrayWindow.webContents.send(action, data || {})
  }
}

async function getUserInfo() {
  await baseApi.init()
  return  baseApi.axios('/app/getUserInfo', {fields: 'fans,follow,grade,post_count,signature,nickname,avatar'}, 'get')
}

let TrayWindow=null
function getTrayWindow(){
  if(TrayWindow===null){
    createTrayWin()
  }
  return TrayWindow
}

async function getMemory() {
  let mem = await osu.mem.info()
  let info = {
    mem: mem,
  }
  return info
}

function createTrayWin () {
  TrayWindow = new BrowserWindow({
    frame: false,
    width: 400,
    height: 600,
    sandbox: false,
    // disableDialogs:true,
    resizable: false,
    autoHideMenuBar: true,
    show: false,
    focusable: true,
    acceptFirstMouse: true,
    maximizable: false,
    alwaysOnTop: false,//调整窗口层级
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  })
  TrayWindow.webContents.loadURL(getUrl('tray.html'))
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
  if(process.platform==='darwin'){
    tray = new Tray(path.join(__dirname,'/icons/tray/mac/tray.png'))
  }else{
    tray = new Tray(path.join(__dirname,'/img/touxiang.png'))
  }


  tray.setToolTip("我是托盘菜单")
  tray.on('click', function(event,position) {
    var obj = Object.keys(viewMap);
    var pageCount = obj.map(key => viewMap[key]).length
    var appCount = appManager.saApps.length
    getUserInfo().then(r => {
      sendIPCToTrayWindow('userInfo',r.data)
    })

    getMemory().then(r =>{
      sendIPCToTrayWindow('getMemory', {
        mem:r,
        pageCount:pageCount,
        appCount:appCount
      })
    })

    getTrayWindow()
    if(mainWindow!=null && !mainWindow.isDestroyed()){
      TrayWindow.setPosition(position.x - 350,position.y - 600)
    }
    TrayWindow.show()
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

  tray.on('right-click', function(event,position) {
    const contextMenu = Menu.buildFromTemplate([
      {
        label: '打开主界面',
        click: () => {
          mainWindow.show()
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
        label: '退出',
      },
    ])
    tray.setContextMenu(contextMenu)
  })
})

