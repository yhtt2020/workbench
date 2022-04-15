let globalSearch = null
let globalSearchTransparent

const globalSearchMod = {
  init: function() {
    if(globalSearch !== null) {
      if(globalSearch.isFocused()) {
        globalSearch.hide()
      } else {
        globalSearch.show()
        globalSearch.focus()
      }
      return
    }
    if(isWin) {
      globalSearchTransparent = false
    } else {
      globalSearchTransparent = true
    }
    globalSearch = new BrowserWindow({
      alwaysOnTop: true,
      minimizable: false,
      parent: null,
      width: 600,
      height: 280,
      minHeight: 150,
      maxHeight: 520,
      maximizable:false,
      resizable: false,
      frame: false,
      backgroundColor: '#00000000',
      transparent: `${globalSearchTransparent}`,
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
    globalSearch.webContents.loadURL('file://' + __dirname + '/pages/globalSearch/index.html')

    globalSearch.on('close', () => globalSearch = null)

    globalSearch.webContents.on('did-finish-load', () => {
      globalSearch.webContents.send('viewLoaded')
    })

    globalSearch.on('blur', () => {
      globalSearch.hide()
    })
  }
}

app.whenReady().then(() => {
  // Register a 'CommandOrControl+X' shortcut listener.
  globalShortcut.register('Alt+F', () => {
    globalSearchMod.init()
  })


  ipc.on(ipcMessageMain.sidePanel.openGlobalSearch, () => {
    globalSearchMod.init()
  })


  ipc.on('transmitTaskList', (event, args) => {
    if(globalSearch) {
      globalSearch.webContents.send('processTransmitTaskList', args)
    }
  })

  ipc.on('changeBrowserWindowHeight', (event, args)=> {
    globalSearch.setSize(600, args)
  })

  ipc.on('closeGlobalSearch', () => {
    globalSearch.hide()
  })

})
