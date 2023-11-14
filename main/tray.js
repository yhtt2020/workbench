const { Tray } = require('electron')
const baseApi = require('./src/api/baseApi.js')
var osu = require('node-os-utils')
const ToolboxManager = require('./src/main/toolboxManager')
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
  try {
    await baseApi.init()
  } catch (e) {
    console.error(e)
  }
  let rs = await baseApi.axios('/app/getUserInfo', { fields: 'uid,fans,follow,grade,post_count,signature,nickname,avatar,frame' }, 'get')
  return rs
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

function openWorktable () {
  if (global.tableWin && !global.tableWin.window.isDestroyed()) {
    global.tableWin.window.show()
    global.tableWin.window.focus()
  } else {
    global.tableManager.init().then(() => {
      global.tableWin.window.show()
    })
  }
}

function openToolbox () {
  ToolboxManager.ensure()
  global.toolboxManager.open()
}

function openBrowser () {
  if (!mainWindow) {
    createWindow()
  } else {
    mainWindow.show()
  }
}

let tray = null
app.whenReady().then(() => {

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
    let open = settings.get('trayOpen')
    if (open === 'browser') {
      openBrowser()
    } else {
      openWorktable()
    }

  })

  tray.on('right-click', () => {
    let tableRunning = global.tableWin && !global.tableWin.window.isDestroyed()
    const keyM = global.keyMapManager
    const tool = keyM.getKeyMap('superTools', true)
    const table = keyM.getKeyMap('table', true)
    const globalSearch = keyM.getKeyMap('globalSearch', true)
    let tpl = [

      {
        label: '打开工作台 ' + '         ' + table,
        Accelerator: table,
        click: () => {
          openWorktable()
        }
      },
      {
        label: '打开工具箱 ' + '         ' + tool,
        Accelerator: tool,
        click: () => {
          openToolbox()
        }
      },
      {
        label: '重置工作台窗口位置(找回)',
        click: () => {
          if (global.tableWin && !global.tableWin.window.isDestroyed()) {
            global.tableWin.close()
            setTimeout(() => {
              settings.set('tableWinSetting', undefined)
              global.tableManager.init().then(() => {
                global.tableWin.window.show()
              })
            }, 500)

          } else {
            settings.set('tableWinSetting', undefined)
            global.tableManager.init().then(() => {
              global.tableWin.window.show()
            })
          }
        }
      },
      {
        type: 'separator'
      },
      {
        label: '打开浏览器',
        click: () => {
          openBrowser()
        }
      },
      {
        label: '浏览器全局搜索' + '    ' + globalSearch,
        click: () => {
          globalSearchMod.init()
          // statsh 点击打开全局搜索
          if (global.globalSearch && global.globalSearch.isFocused()) {
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

      {
        label: '切换账号空间',
        click: () => {
          showUserWindow()
        }
      },

      {
        type: 'separator'
      },

    ]


    tpl.push(
      {
        label: '社区和反馈',
        click () {
          require('electron').shell.openPath(userDataPath)
        },
        submenu: [{
          label: '打开官网',
          click () {
            require('electron').shell.openExternal('https://www.apps.vip')
          }
        },
          {
            label: '产品社区',
            click () {
              require('electron').shell.openExternal('https://s.apps.vip')
            }
          },
          {
            label: '提交bug和建议',
            click () {
              require('electron').shell.openExternal('https://s.apps.vip/forum?id=100304')
            }
          }]
      }
      ,
      {
        label: '打开用户数据目录',
        click () {
          require('electron').shell.showItemInFolder(userDataPath)
        }
      }
      ,
      {
        label: '全部退出',
        click () {
          global.trayExit = true
          app.exit()
        }
      })
    if (tableRunning) {
      tpl.splice(tpl.length-1,0,{
        label: '退出工作台',
        click () {
          global.tableManager.close()
        }
      })
    }
    const contextMenu = Menu.buildFromTemplate(tpl)
    tray.popUpContextMenu(contextMenu)
  })
})
