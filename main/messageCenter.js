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
      height: 860,
      maximizable:false,
      resizable: false,
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

  ipc.on('mainIsSilent', (event, args) => {
    SidePanel.send('isSilent', args)
  })

  ipc.on('mesageOpenOperate', (event, args) => {
    if(args.type === 'groupChat') {
      const GROUP_PKG='com.thisky.group'
      if(appManager.isAppProcessingByPackage(GROUP_PKG)) {
        //通过借助preload对vue直接clicktab操作
        appManager.showAppWindowByPackage(GROUP_PKG)
        appManager.getWindowByPackage(GROUP_PKG).view.webContents.send('switchChat', args.indexName)
      } else {
        sendMessage({type:"error",config:{content:'团队沟通未运行',key: Date.now()}})
      }
    } else if(args.type === 'community') {
      //todo
    }
  })

  //ipc.on('')
})
