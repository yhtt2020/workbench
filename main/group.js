let groupIMWindow=null
app.on('ready', () => {
  let createGroupWindow = null
  ipc.on('createGroup', () => {
    if (createGroupWindow !== null ) {
      createGroupWindow.focus()
      return //如果已经创建了，则不再重复创建
    }
    createGroupWindow = new BrowserWindow({
      backgroundColor: 'black',
      parent: mainWindow,
      width: 440,
      height: 640,
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
  })
  ipc.on('closeCreateGroupWindow', () => {
    createGroupWindow.destroy()
    createGroupWindow = null
  })

  ipc.on('refreshMyGroups', () => {
    if(SidePanel.alive()) {
      sidePanel.get().webContents.send('refreshMyGroups')
    }
  })
  function createGroupIMWindow(){
    if(groupIMWindow===null){
      groupIMWindow = new BrowserWindow({
        frame: true,
        backgroundColor: 'white',
        parent: mainWindow,
        modal: false,
        hasShadow: true,
        minWidth: 600,
        width:900,
        autoHideMenuBar: true,
        minHeight: 600,
        height:700,
        x: 50+ mainWindow.getBounds().x,
        y: 150 +mainWindow.getBounds().y,
        acceptFirstMouse: true,
        maximizable: false,
        visualEffectState: 'active',
        //alwaysOnTop: true,
        webPreferences: {
          preload:path.join(__dirname, '/pages/group/imPreload.js'),
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
      groupIMWindow.setMenu(null)
      let im_url=''
      if(isDevelopmentMode){
         im_url=require(path.join(__dirname, '//server-config.js')).config.IM.FRONT_URL_DEV
      }else{
         im_url=require(path.join(__dirname, '//server-config.js')).config.IM.FRONT_URL
      }
      groupIMWindow.webContents.loadURL(im_url)
      groupIMWindow.on('close',()=>groupIMWindow=null)
    }else{
      groupIMWindow.focus()
    }
  }
  ipc.on('openGroup',(event,args)=>{
    createGroupIMWindow()
  })
})
