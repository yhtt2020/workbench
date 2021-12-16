let userScriptWindow = null

function createUserScriptWin (args) {
  // url:当前网页的url，完整的url
  // pos：展现坐标位置
  // title：窗口标题，站点名称
  // tabData：当前的tab对象
  if (userScriptWindow === null) {
    userScriptWindow = new BrowserWindow({
      frame: true,
      backgroundColor: 'white',
      parent: mainWindow,
      center:true,
      hasShadow: true,
      minWidth: 800,
      width: 800,
      autoHideMenuBar: true,
      minHeight: 600,
      height: 600,
      acceptFirstMouse: true,
      maximizable: false,
      visualEffectState: 'active',
      alwaysOnTop: true,
      webPreferences: {
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
    var parent_x = mainWindow.getPosition()[0]
    var parent_y = mainWindow.getPosition()[1]
    var parent_size_x = mainWindow.getSize()[0]
    var parent_size_y = mainWindow.getSize()[1]
    var userScriptWindow_size_x = userScriptWindow.getSize()[0]
    var userScriptWindow_size_y = userScriptWindow.getSize()[1]
    var userScriptWindows_new_x = parent_x + (parent_size_x - userScriptWindow_size_x) / 2
    var userScriptWindow_new_y = parent_y + (parent_size_y - userScriptWindow_size_y) / 2
    userScriptWindow.setPosition(parseInt(userScriptWindows_new_x), parseInt(userScriptWindow_new_y), false)

    userScriptWindow.webContents.loadURL('file://' + __dirname + '/pages/userScript/index.html')
    //siteCardWindow.webContents.openDevTools()
    userScriptWindow.on('close', () => userScriptWindow = null)
    userScriptWindow.on('show', () => {
      userScriptWindow.focus()
    })

  } else {
    userScriptWindow.close()
    userScriptWindow = null
  }
}
app.whenReady().then(()=>{
  ipc.on('openScriptManager', (event, args) => {
    createUserScriptWin()
  })
})
