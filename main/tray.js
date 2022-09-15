const { Tray } = require('electron')
const baseApi = require('./src/api/baseApi.js')
const {require} = require("@electron/remote");
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
  tray = new Tray(path.join(__dirname,'/img/touxiang.png'))

  tray.setToolTip("我是托盘菜单")
  tray.on('click', function(event,position) {
    getUserInfo().then(r => {
      sendIPCToTrayWindow('userInfo',r.data)
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
      { label: '打开主界面'},
      { label: '切换账号空间'},
      { label: '全局搜索'},
      { label: '退出'},
    ])
    tray.setContextMenu(contextMenu)
  })
})


ipc.on('release',()=>{
  var obj = Object.keys(viewMap);
  var pageCount = obj.map(key => viewMap[key]);
  console.log(pageCount.length)

  console.log()
})
