let messageCenter = {
  lumen: [],
  webOs: []
}

let messInstance = null
let msmSetting = null

const MessageMod = {
  init: function() {
    messInstance = new BrowserWindow({
      frame: false,
      parent: mainWindow,
      hasShadow: false,
      width: 0,
      height: 0,
      resizable: false,
      acceptFirstMouse: true,
      roundedCorners: true,
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

    messInstance.loadURL('file://' + __dirname + '/pages/messageCenter/message/index.html')
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
    if(messInstance !== null && !messInstance.isVisible()) {
      messInstance.show()
      messInstance.focus()
      return
    } else if(messInstance !== null && messInstance.isVisible()) {
      messInstance.hide()
      return
    }
    MessageMod.init()
  })

  ipc.on(ipcMessageMain.sidePanel.openMsmSetting, () => {
    if(msmSetting !== null) {
      msmSetting.focus()
      return
    }
    msmSetting = new BrowserWindow({
      minimizable: false,
      parent: null,
      width: 660,
      height: 800,
      maximizable:false,
      resizable: false,
      title: '通知中心设置',
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
    msmSetting.webContents.loadURL('file://' + __dirname + '/pages/messageCenter/centerSetting/setting.html')
    msmSetting.on('close', () => msmSetting = null)
  })
})
