let wizard = null
app.whenReady().then(()=>{
  ipc.on('wizard', (event,args) => {
    if(!!!wizard){
      let page='index'
      if(!!args){
        page=args.page?'index':args.page
      }
      console.log(page)
      //closeSidePanel()
      //mainWindow.hide()
      wizard = new BrowserWindow({
        width:860,
        height:760,
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

      wizard.webContents.loadURL('file://' + __dirname + `/pages/wizard/`+page+`.html`)
      // wizard.webContents.openDevTools()
      // setTimeout(() => {
      //   wizard.focus()
      // }, 1000)

      ipc.on('closeWizard',()=>{
        wizard.close()
        //destroyAllViews()
        //mainWindow.webContents.reload()
        //mainWindow.show()//app.relaunch()
        //loadSidePanel()
      })
    }

  })
})
