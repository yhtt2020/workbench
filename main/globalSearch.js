let globalSearch = null

const globalSearchMod = {
  init: function () {
    if (globalSearch !== null) {
      if (globalSearch.isFocused()) {
        globalSearch.hide()
      } else {
        globalSearch.show()
        globalSearch.focus()
      }
      return
    }
    if (isWin) {
      globalSearch = new BrowserWindow({
        alwaysOnTop: true,
        minimizable: false,
        parent: null,
        width: 600,
        height: 280,
        minHeight: 150,
        maxHeight: 520,
        maximizable: false,
        resizable: true,
        frame: false,
        backgroundColor: '#fff',
        webPreferences: {
          devTools: true,
          preload: path.join(__dirname, '/src/preload/searchPreload.js'),
          nodeIntegration: true,
          contextIsolation: false,
          additionalArguments: [
            '--user-data-path=' + userDataPath,
            '--app-version=' + app.getVersion(),
            '--app-name=' + app.getName(),
            ...((isDevelopmentMode ? ['--development-mode'] : [])),
          ]
        }
      })
    } else {
      globalSearch = new BrowserWindow({
        alwaysOnTop: true,
        minimizable: false,
        parent: null,
        width: 600,
        height: 280,
        minHeight: 150,
        maxHeight: 520,
        maximizable: false,
        resizable: false,
        frame: false,
        backgroundColor: '#00000000',
        transparent: true,
        webPreferences: {
          devTools: true,
          nodeIntegration: true,
          contextIsolation: false,
          additionalArguments: [
            '--user-data-path=' + userDataPath,
            '--app-version=' + app.getVersion(),
            '--app-name=' + app.getName(),
            ...((isDevelopmentMode ? ['--development-mode'] : [])),
          ]
        }
      })
    }

    globalSearch.webContents.loadURL(render.getUrl('search.html'))

    globalSearch.on('close', () => globalSearch = null)

    globalSearch.webContents.on('did-finish-load', () => {
      globalSearch.webContents.send('viewLoaded')
    })

    globalSearch.on('blur', () => {
      globalSearch.hide()
    })

    globalSearch.on('will-resize', (event, args) => {
      event.preventDefault()
    })
  }
}
const TableManager = require('./src/main/tableManager.js')
const TableAppManager = require('./src/main/tableAppManager.js')
const TableTabManager = require('./src/main/tableTabManager')
global.tableManager = new TableManager()
app.whenReady().then(async () => {
  global.tableAppManager = new TableAppManager()
  tableAppManager.bindIPC()
  global.tableTabManager=new TableTabManager()
  tableTabManager.bindIPC()
  let registerTableShortcutResult = false
  let registerGlobalSearchShortcutResult =false

  /**
   * 获得一个键位
   * @param name
   * @param defaultValue
   * @returns {*}
   */
  function getKeyMap (name, defaultValue) {
    const keyMapModule = require('./js/util/keyMap.js')
    const keyMap = keyMapModule.userKeyMap(settings.get('keyMap'))
    let key = defaultValue//默认快捷键为alt+space
    if (keyMap) {
      if (keyMap[name]) {
        key = keyMap[name]
      }
    }
    return key
  }

  /**
   * 设置一个键位
   * @param name
   * @param key
   */
  function setKeyMap (name, key) {
    const keyMapModule = require('./js/util/keyMap.js')
    const keyMap = keyMapModule.userKeyMap(settings.get('keyMap'))
    keyMap[name] = key
    settings.set('keyMap', keyMap)
  }

  /**
   * 注册工作台的全局搜索
   * @returns {Promise<void>}
   */
  async function registerTableShortcut () {
    let key = getKeyMap('table', 'Alt+space')//默认快捷键为alt+space
    let registerResult = await globalShortcut.register(key, async () => {
      await callTable()
    })
    if (registerResult === false) {
      registerTableShortcutResult = false
      let notification = new Notification({
        title: '工作台通知',
        body: '呼出工作台快捷键[' + key + ']被占用，请修改快捷键后使用。为您直接打开工作台。',
        timeoutType: 'never'
      })
      notification.show()
      await callTable(2)
    } else {
      registerTableShortcutResult = true
    }
  }

  registerTableShortcut().then()//注册工作台的全局快捷键
  ipc.on('setTableShortcut', async (e, a) => {
    //接收到设置工作台快捷键的消息
    let rs
    try{
       rs = await globalShortcut.register(a.shortcut, async () => {
        await callTable()
      })
    }catch (e) {
      e.returnValue = false
    }


    if (rs) {
      let oldKey = 'alt+space'
      //成功则更改快捷键设置
      const keyMap = getKeyMap('table', 'alt+space')
      oldKey = keyMap
      setKeyMap('table', a.shortcut)//设置新快捷键
      if (registerTableShortcutResult) {
        //如果之前注册是成功的，则取消，否则则不需要取消
        globalShortcut.unregister(oldKey)
      }
      registerTableShortcutResult = true
      e.returnValue = true
    } else {
      e.returnValue = false
    }
  })
  ipc.on('setGlobalShortcut', async (e, a) => {
    let rs
    try{
      rs = await globalShortcut.register(a.shortcut, async () => {
        globalSearchMod.init()

        // statsh 快捷键打开全局搜索
        if (globalSearch && globalSearch.isFocused()) {
          statsh.do({
            action: 'increase',
            key: 'globalSearchBaseShortOpen',
            value: 1
          })
        }
      })
    }catch (e) {
      e.returnValue = false
    }


    if (rs) {
      let oldKey = 'alt+f'
      //成功则更改快捷键设置
      const keyMap = getKeyMap('globalSearch', 'alt+f')
      oldKey = keyMap
      setKeyMap('globalSearch', a.shortcut)//设置新快捷键
      if (registerGlobalSearchShortcutResult) {
        //如果之前注册是成功的，则取消，否则则不需要取消
        globalShortcut.unregister(oldKey)
      }
      registerGlobalSearchShortcutResult = true
      e.returnValue = true
    } else {
      e.returnValue = false
    }

    e.returnValue = true
  })

  async function callTable (tag = -1) {
    tableManager.init().then(()=>{
      global.tableAppManager.setTableWin(tableManager.window)
      global.tableTabManager.setTableWin(tableManager.window)
    })
  }

  let tableMod = settings.get('tableMod')
  if (tableMod === undefined || tableMod === 'table') {
    callTable(1).then()//呼出工作台
  }

  function registerSearch () {
    // Register a 'CommandOrControl+X' shortcut listener.
    const keyMap = settings.get('keyMap')
    let quick = 'Alt+F'
    if (keyMap) {
      if (keyMap.globalSearch) {
        quick = keyMap.globalSearch
      }
    }
    globalShortcut.register(quick, () => {
      globalSearchMod.init()

      // statsh 快捷键打开全局搜索
      if (globalSearch && globalSearch.isFocused()) {
        statsh.do({
          action: 'increase',
          key: 'globalSearchBaseShortOpen',
          value: 1
        })
      }
    })
  }

  registerSearch()

  ipc.on(ipcMessageMain.sidePanel.openGlobalSearch, () => {
    globalSearchMod.init()

    // statsh 点击打开全局搜索
    if (globalSearch && globalSearch.isFocused()) {
      statsh.do({
        action: 'increase',
        key: 'globalSearchBaseClickOpen',
        value: 1
      })
    }
  })

  ipc.on('transmitTaskList', (event, args) => {
    if (globalSearch) {
      globalSearch.webContents.send('processTransmitTaskList', args)
    }
  })

  ipc.on('changeBrowserWindowHeight', (event, args) => {
    globalSearch.setSize(600, args)
  })

  ipc.on('closeGlobalSearch', () => {
    globalSearch.hide()
  })






  ipc.handle('shell', (event, args) => {
    if (args.cmd) {
      require('child_process').exec(__dirname + '/ext/cmd/x64/nircmdc.exe ' + args.cmd, (err, stdout, stderr) => {
        console.log({
          err, stdout, stderr
        })
        event.returnValue = {
          err, stdout, stderr
        }
      })
    }
  })

})
