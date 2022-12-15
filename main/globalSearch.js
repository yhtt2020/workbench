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
          preload: path.join(__dirname, '/pages/globalSearch/preload.js'),
          nodeIntegration: true,
          contextIsolation: false,
          additionalArguments: [
            '--user-data-path=' + userDataPath,
            '--app-version=' + app.getVersion(),
            '--app-name=' + app.getName(),
            ...((isDevelopmentMode ? ['--development-mode'] : []))
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
            ...((isDevelopmentMode ? ['--development-mode'] : []))
          ]
        }
      })
    }

    globalSearch.webContents.loadURL('file://' + __dirname + '/pages/globalSearch/index.html')

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

app.whenReady().then(() => {
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
})
