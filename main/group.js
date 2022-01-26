let groupIMWindow=null
let alwaysHide = false
app.on('ready', () => {
  let createGroupWindow = null
  let fromRender = null
  let teamTip = null
  let osxSearchMember = null
  let osxInviteMember = null
  let osxCircleSetting = null
  ipc.on('createGroup', (event, arg) => {
    if (createGroupWindow !== null ) {
      createGroupWindow.focus()
      return //如果已经创建了，则不再重复创建
    }
    createGroupWindow = new BrowserWindow({
      backgroundColor: 'black',
      parent: mainWindow,
      width: 420,
      height: 720,
      maximizable:false,
      resizable: false,
      acceptFirstMouse: true,
      webPreferences: {
        //preload: path.join(__dirname, '/pages/group/create.js'),
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
    createGroupWindow.setMenu(null)
    createGroupWindow.webContents.loadURL('file://' + __dirname + '/pages/group/create.html')
    createGroupWindow.on('close',()=>createGroupWindow=null)
    if(arg) {
      if(arg.from === 'groupComp') {
        //消息来源，后续需要返回消息的webContents，这里只对groupComp发来的ipc通信做存储
        fromRender = event.sender
      }
    }
  })
  ipc.on('closeCreateGroupWindow', () => {
    createGroupWindow.destroy()
    createGroupWindow = null
  })

  ipc.on('refreshGroupComp', (event, arg) => {
    if(fromRender) {
      fromRender.send('callback-refreshGroupComp')
    }
    fromRender = null
  })

  ipc.on('refreshMyGroups', () => {
    //同在main中可以直接拿到SidePanel的webContents
    if(SidePanel.alive()) {
      sidePanel.get().webContents.send('refreshMyGroups')
    }
  })

  //圈子创建引导页
  ipc.on('teamTip', (event, args) => {
    if (teamTip !== null ) {
      teamTip.focus()
      return
    }
    teamTip = new BrowserWindow({
      minimizable: false,
      parent: null,
      width: 600,
      height: 420,
      maximizable:false,
      resizable: false,
      webPreferences: {
        //preload: path.join(__dirname, ''),
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
    teamTip.webContents.loadURL('file://' + __dirname + '/pages/group/teamTip/index.html')
    teamTip.on('close', () => teamTip = null)
  })

  //圈子搜索添加成员
  ipc.on('osxOpenSearchMember', (event, args) => {
    if(osxSearchMember !== null) {
      osxSearchMember.focus()
      return
    }
    osxSearchMember = new BrowserWindow({
      minimizable: false,
      parent: null,
      width: 500,
      height: 620,
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
    //todo  圈子搜索添加成员url
    osxSearchMember.webContents.loadURL('')
    osxSearchMember.on('close', () => osxSearchMember = null)
  })

  //圈子邀请添加成员
  ipc.on('osxOpenInviteMember', (event, args) => {
    if(osxInviteMember !== null) {
      osxInviteMember.focus()
      return
    }
    osxInviteMember = new BrowserWindow({
      minimizable: false,
      parent: null,
      width: 420,
      height: 300,
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
    //todo 圈子邀请添加成员url
    osxInviteMember.webContents.loadURL('')
    osxInviteMember.on('close', () => osxInviteMember = null)
  })

  //圈子设置
  ipc.on('osxOpenCircleSetting', (event, args) => {
    if(osxCircleSetting !== null) {
      osxCircleSetting.focus()
      return
    }
    osxCircleSetting = new BrowserWindow({
      minimizable: false,
      parent: null,
      width: 640,
      height: 660,
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
    osxCircleSetting.webContents.loadURL('')
    osxCircleSetting.on('close', () => osxCircleSetting = null)
  })

  ipc.on('sdkHideApp', () => {
    groupIMWindow.hide()
  })

  ipc.on('sdkTabNavigate', (event, args) => {
    if(groupIMWindow) {
      sendIPCToWindow(mainWindow, 'tabNavigateTo', {url: args.url})
    }
  })

  ipc.on('sdkDestoryApp', () => {
    groupIMWindow.destroy()
    groupIMWindow=null
    alwaysHide = false
  })

})

app.on('before-quit', () => {
  if(groupIMWindow) {
    groupIMWindow.destroy()
    groupIMWindow = null
  }
})
