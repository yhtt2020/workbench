const { Tray } = require('electron')
const baseApi = require('./src/api/baseApi.js')
var osu=require('node-os-utils')
// const {require} = require("@electron/remote");
// var viewMap = require('viewManager.js')


function sendIPCToTrayWindow (action, data) {
  // if there are no windows, create a new one
  if (trayWindow === null) {
    getTrayWindow(function () {
      trayWindow.webContents.send(action, data || {})
    })
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
    height: 580,
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
    tray = new Tray(path.join(__dirname,'/icons/tray/win/tray.png'))
  }

  getTrayWindow()

  setInterval(function () {
    var obj = Object.keys(viewMap);
    var pageCount = obj.map(key => viewMap[key]).length
    var appCount = appManager.saApps.length
    getMemory().then(r =>{
      sendIPCToTrayWindow('getMemory', {
        mem:r,
        pageCount:pageCount,
        appCount:appCount
      })
    })
  }, 2000)

  trayWindow.on('blur',()=>{
    trayWindow.hide()
  })


  tray.setToolTip("我是托盘菜单")
  tray.on('click', function(event,position) {
    getUserInfo().then(r => {
      sendIPCToTrayWindow('userInfo',r.data)
    })

    if(mainWindow!=null && !mainWindow.isDestroyed()){
      trayWindow.setPosition(position.x - 350,position.y - 580)
    }
    trayWindow.show()
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
