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
  return  baseApi.axios('/app/getUserInfo', {fields: 'uid,fans,follow,grade,post_count,signature,nickname,avatar'}, 'get')
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
    height: 430,
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
      sandbox:false,
      webSecurity:false,
      preload:(__dirname+'/src/preload/trayPreload.js'),
      additionalArguments: [
        '--user-data-path=' + app.getPath('userData'),
        '--app-version=' + app.getVersion(),
        '--app-name=' + app.getName(),
        ...((isDevelopmentMode ? ['--development-mode'] : [])),
      ],
    }
  })
  trayWindow.webContents.loadURL(getUrl('tray.html'))
  trayWindow.on('ready-to-show',()=>{
    trayWindow.show()
  })
  trayWindow.on('blur',()=>{
    trayWindow.close()
    trayWindow=null
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
  async function uploadCumulativeTime() {
    try{
      const userInfo = await userModel.getCurrent()
      const options = {
        uid:  userInfo && userInfo.data.uid != 0 ? userInfo.data.uid : 0,  //用户uid
        client_id: settings.get('clientID'),     //设备号
      }

      await baseApi.init()
      baseApi.axios('/app/open/usageStats/cumulativeTime', options,'post').catch(e => {
        console.warn('上传在线时长失败', e)
      })
    }catch (e) {
      console.warn('上传在线时间意外错误', e)
    }

  }
  setInterval(uploadCumulativeTime, 1000 * 60) //每分钟上报在线时间



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
  ipc.on('getTrayUserInfo',(event,args)=>{
    getUserInfo().then(result => {
      sendIPCToTrayWindow('userInfo',result.data)
    }).catch(()=>{
      sendIPCToTrayWindow('userInfo',{})
    })
  })
  ipc.on('resizeTray',(event,args)=>{
    if(trayWindow){
      trayWindow.setSize(args.width,args.height)
    }
  })

  if(process.platform==='darwin'){
    tray = new Tray(path.join(__dirname,'/icons/tray/mac/tray.png'))
  }else{
    tray = new Tray(path.join(__dirname,'/icons/logowin.ico'))
  }
  tray.setToolTip("想天浏览器")
  tray.on('click', function(event,position) {
    getTrayWindow()
    let bounds=trayWindow.getBounds()
    trayWindow.setPosition(position.x - bounds.width,position.y - bounds.height)
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
      type:'separator'
    },
    {
      label: '关闭浏览器',
      click(){
        app.exit()
      }
    },
  ])
  tray.on('double-click',()=>{
    if(!mainWindow){
      createWindow()
    }else{
      mainWindow.show()
    }
  })
  tray.on('right-click',()=>{
    tray.popUpContextMenu(contextMenu)
  })
})
