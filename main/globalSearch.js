let globalSearch = null

app.whenReady().then(() => {
  // Register a 'CommandOrControl+X' shortcut listener.
  globalShortcut.register('Alt+F', () => {
    if(globalSearch !== null) {
      globalSearch.close()
      return
    }
    globalSearch = new BrowserWindow({
      alwaysOnTop: true,
      minimizable: false,
      parent: null,
      width: 600,
      minHeight: 150,
      maxHeight: 350,
      maximizable:false,
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
    globalSearch.webContents.loadURL('file://' + __dirname + '/pages/globalSearch/index.html')
    globalSearch.on('close', () => globalSearch = null)
  })


  ipc.on(ipcMessageMain.sidePanel.openGlobalSearch, () => {
    if(globalSearch !== null) {
      globalSearch.close()
      return
    }
    globalSearch = new BrowserWindow({
      alwaysOnTop: true,
      minimizable: false,
      parent: null,
      width: 600,
      height: 540,
      // minHeight: 150,
      // maxHeight: 350,
      maximizable:false,
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
    globalSearch.webContents.loadURL('file://' + __dirname + '/pages/globalSearch/index.html')
    globalSearch.on('close', () => globalSearch = null)
  })


  ipc.on('transmitTaskList', (event, args) => {
    if(globalSearch) {
      globalSearch.webContents.send('processTransmitTaskList', args)
    }
  })

})
