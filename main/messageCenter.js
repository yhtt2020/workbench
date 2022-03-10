let messageCenter = {
  lumen: [],
  webOs: []
}

let msmSetting = null

app.whenReady().then(() => {

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
    msmSetting.webContents.loadURL('file://' + __dirname + '/pages/messageCenterSetting/setting.html')
    msmSetting.on('close', () => msmSetting = null)
  })
})
