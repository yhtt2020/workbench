let wizard = null
app.whenReady().then(()=>{
  function loadWizard(page='index'){
    if(!!!wizard){
      //closeSidePanel()
      //mainWindow.hide()
      let width=860
      let height=840
      switch (page){
        case 'apps':
          width=600
          height=800
      }

      wizard = new BrowserWindow({
        width:width,
        height:height,
        minimizable:false,
        maximizable:false,
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


    }
  }
  ipc.on('closeWizard',(event,args)=>{
    if(wizard){
      wizard.close()
      wizard=null
      if(args && args.next==='apps'){
        setTimeout(()=>{
          loadWizard(args.next)
        },args.delay)
      }
    }
    //destroyAllViews()
    //mainWindow.webContents.reload()
    //mainWindow.show()//app.relaunch()
    //loadSidePanel()
  })
  ipc.on('wizard', (event,args) => {
    let page='index'
    if(!!args){
      page=args.page?args.page:'index'
    }
    loadWizard(page)
  })
})
