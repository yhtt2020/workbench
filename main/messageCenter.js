let messageCenter = {
  lumen: [],
  webOs: []
}

let messInstance = null

const MessageMod = {
  init: function() {
    messInstance = new BrowserWindow({
      parent: mainWindow,
      hasShadow: false,
      width: 0,
      height: 0,
      resizable: false,
      acceptFirstMouse: true,
      visualEffectState: 'active',
      webPreferences: {
        devTools: true,
        //preload: path.join(__dirname, '/pages/sidebar/sidebarPreload.js'),
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

    messInstance.loadURL('file://' + __dirname + '/pages/messageCenter/index.html')
    MessageMod.syncSize()
    messInstance.on('close', () => messInstance = null)
  },

  syncSize: function() {
    let bounds = mainWindow.getBounds()
    let setX = bounds.x + 50
    let setY = bounds.y
    messInstance.setBounds({
      x: setX,
      y: setY + 280,
      width: 300,
      height: 600
    })
  }
}


app.whenReady().then(() => {
  ipc.on(ipcMessageMain.sidePanel.openMessageCenter, () => {
    console.log('safdsfsafsdffsfa', messInstance)
    if(messInstance !== null) {
      messInstance.focus()
      return
    }
    MessageMod.init()
  })
})
