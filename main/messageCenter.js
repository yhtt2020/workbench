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
      if(appManager.isAppProcessing(args.saAppId)) {
        //通过借助preload对vue直接clicktab操作
        appManager.showAppWindow(args.saAppId)
        appManager.getWindowByAppId(args.saAppId).view.webContents.send('switchChat', args.indexName)
      } else {
        sidePanel.get().webContents.send('message',{type:"error",config:{content:'团队沟通未运行',key: Date.now()}})
      }
    } else if(args.type === 'community') {
      //todo
    }
  })

  //ipc.on('')
})
