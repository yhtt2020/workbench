let createGroupWindow = null
app.on('ready', () => {

  ipc.on('createGroup', () => {
    if (createGroupWindow != null) {
      createGroupWindow.focus()
      return //如果已经创建了，则不再重复创建
    }
    createGroupWindow = new BrowserWindow({
      backgroundColor: 'black',
      parent: mainWindow,
      width: 360,
      height: 530,
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
    createGroupWindow.webContents.loadURL('file://' + __dirname + '/pages/group/create.html')
  })
  ipc.on('closeCreateGroupWindow', () => {
    createGroupWindow.close()
    createGroupWindow = null
  })
})
