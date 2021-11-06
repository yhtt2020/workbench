let wizard = null
ipc.on('wizard', () => {
  if(!!!wizard){
    wizard = new BrowserWindow({
      width:860,
      height:740,
      resizable: false,
      acceptFirstMouse: true,
      parent:mainWindow,
      autoHideMenuBar :true,
      webPreferences: {
        preload: path.join(__dirname, '/pages/wizard/preload.js'),
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
    wizard.webContents.loadURL('file://' + __dirname + "/pages/wizard/index.html")
    wizard.webContents.openDevTools()
    setTimeout(() => {
      wizard.focus()
    }, 1000)

    ipc.on('closeWizard',()=>{
      wizard.close()
    })
  }

})
