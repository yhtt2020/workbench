const { Tray } = require('electron')
const baseApi = require('./src/api/baseApi.js')
var osu = require('node-os-utils')
// const {require} = require("@electron/remote");
// var viewMap = require('viewManager.js')

function sendIPCToTrayWindow (action, data) {
  // if there are no windows, create a new one
  if (trayWindow === null) {

  } else {
    trayWindow.webContents.send(action, data || {})
  }
}

async function getUserInfo () {
  await baseApi.init()
  return baseApi.axios('/app/getUserInfo', { fields: 'uid,fans,follow,grade,post_count,signature,nickname,avatar' }, 'get')
}

let trayWindow = null

async function getTrayWindow () {
  if (trayWindow === null) {
    await createTrayWin()
  }
  return trayWindow
}

async function getMemory () {
  const mem = await osu.mem.info()
  const info = {
    mem: mem
  }
  return info
}

async function createTrayWin () {
  const windowInstance = await windowManager.create({
    name: 'tray',
    windowOption:
        {
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
          transparent: true,
          backgroundColor: '#00000000',
          maximizable: false,
          skipTaskbar: true,
          alwaysOnTop: false// 调整窗口层级

        },
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      sandbox: false,
      webSecurity: false,
      preload: (__dirname + '/src/preload/trayPreload.js'),
      additionalArguments: [
        '--user-data-path=' + app.getPath('userData'),
        '--app-version=' + app.getVersion(),
        '--app-name=' + app.getName(),
        ...((isDevelopmentMode ? ['--development-mode'] : []))
      ]
    }

  }
  )
  trayWindow = windowInstance.window
  trayWindow.webContents.loadURL(getUrl('tray.html'))
  trayWindow.on('ready-to-show', () => {
    trayWindow.show()
  })
  trayWindow.on('blur', () => {
    trayWindow.close()
    trayWindow = null
  })
  trayWindow.on('closed', () => {
    trayWindow = null
  })
}

function getUrl (url) {
  let protocolUrl
  protocolUrl = `tsbapp://./${url}` // todo 需要验证正式环境的协议情况
  if (isDevelopmentMode) {
    protocolUrl = `http://localhost:1600/${url}`
  }
  return protocolUrl
}
function openWorktable(){
  if (global.tableWin && !global.tableWin.window.isDestroyed()) {
    global.tableWin.window.show()
    global.tableWin.window.focus()
  } else {
    global.tableManager.init().then(()=>{
      global.tableWin.window.show()
    })
  }
}
function openBrowser(){
  if (!mainWindow) {
    createWindow()
  } else {
    mainWindow.show()
  }
}
let tray = null
app.whenReady().then(() => {
  async function uploadCumulativeTime () {
    try {
      let clientId=settings.get('clientID')
      if(!clientId){
        clientId=require('nanoid').nanoid(8)
        settings.set('clientID',clientId)
      }
      const userInfo = await userModel.getCurrent()
      const options = {
        uid: userInfo && userInfo.data.uid != 0 ? userInfo.data.uid : 0, // 用户uid
        client_id: clientId // 设备号
      }

      await baseApi.init()
      baseApi.axios('/app/open/usageStats/cumulativeTime', options, 'post').catch(e => {
        console.warn('上传在线时长失败', e)
      }).then((rs) => {
        console.log('提交在线时长成功',rs)
      })
    } catch (e) {
      console.warn('上传在线时间意外错误', e)
    }
  }

  setInterval(uploadCumulativeTime, 1000 * 60) // 每分钟上报在线时间

  ipc.on('getMemory', (event, args) => {
    var obj = Object.keys(viewMap)
    var pageCount = obj.map(key => viewMap[key]).length
    var appCount = appManager.saApps.length
    getMemory().then(info => {
      const data = {
        mem: info,
        pageCount: pageCount,
        appCount: appCount
      }
      event.reply('getMemory', data)
    })
  })
  ipc.on('getDetailUserInfo', async (event, args) => {
    const isLogged = await userModel.isLogged()
    if (isLogged) {
      getUserInfo().then(result => {
        if (result.data.data.uid) {
          event.reply('userInfo', result.data)
        } else {
          event.reply('userInfo', { data: { uid: -2 } }) // -2代表异常
        }
      }).catch(() => {
        event.reply('userInfo', { data: { uid: -2 } }) // -2代表异常
      })
    } else {
      event.reply('userInfo', {
        data: { uid: -1 } // -1代表未登录
      })
    }
  })
  ipc.on('resizeTray', (event, args) => {
    if (trayWindow) {
      trayWindow.setSize(args.width, args.height)
    }
  })

  if (process.platform === 'darwin') {
    tray = new Tray(path.join(__dirname, '/icons/tray/mac/tray.png'))
  } else {
    tray = new Tray(path.join(__dirname, '/icons/logowin.ico'))
  }
  tray.setToolTip('想天工作台')
  // 任务栏点击事件
  let timeCount = 0
  tray.on('click', async function (event, position) {
    setTimeout(async () => {
      if (timeCount === 0) {
        await getTrayWindow()
        const bounds = trayWindow.getBounds()
        trayWindow.setPosition(position.x - bounds.width, position.y - bounds.height)
        timeCount = 0
      }
    }, 300)


  })



  tray.on('double-click', (event) => {
    timeCount = 1
    //兼容新的设置项目
    let open= settings.get('trayOpen')
    if( open==='browser'){
      openBrowser()
    }else{
      openWorktable()
    }


  })
  tray.on('right-click', () => {
    let tableRunning=global.tableWin && !global.tableWin.window.isDestroyed()
    let tpl=[
      {
        label: '打开浏览器',
        click: () => {
         openBrowser()
        }
      },
      {
        label: '打开工作台',
        click: () => {
         openWorktable()
        }
      },
      {
        type: 'separator'
      },
      {
        label: '还原工作台位置',
        click: () => {
          if (global.tableWin && !global.tableWin.window.isDestroyed()) {
            global.tableWin.window.center()
            global.tableWin.window.show()
            global.tableWin.window.focus()
          } else {
            settings.set('tableWinSetting',undefined)
            global.tableManager.init().then(()=>{
              global.tableWin.window.show()
            })
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
          // statsh 点击打开全局搜索
          if (globalSearch && globalSearch.isFocused()) {
            statsh.do({
              action: 'increase',
              key: 'globalSearchBaseClickOpen',
              value: 1
            })
          }
        }
      },
      {
        type: 'separator'
      },

    ]
    if(tableRunning){
      tpl.push({
        label:'退出工作台',
        click(){
          global.tableManager.close()
        }
      })
    }

    tpl.push({
      label: '全部退出',
      click () {
        global.trayExit = true
        app.exit()
      }
    })
    const contextMenu = Menu.buildFromTemplate(tpl)
    tray.popUpContextMenu(contextMenu)
  })
})
