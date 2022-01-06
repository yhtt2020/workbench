let groupIMWindow=null
app.on('ready', () => {
  let createGroupWindow = null
  let fromRender = null
  ipc.on('createGroup', (event, arg) => {
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
  function createGroupIMWindow(){
    let boundsSetting=settings.get('groupWindowBounds')
    if(!boundsSetting){
      boundsSetting={
        x:50+ mainWindow.getBounds().x,
        y:150 +mainWindow.getBounds().y,
        width:900,
        height:700
      }
      //如果未设置，则不用管
    }
    if(groupIMWindow===null){
      groupIMWindow = new BrowserWindow({
        frame: true,
        backgroundColor: 'white',
        parent: mainWindow,
        modal: false,
        hasShadow: true,
        minWidth: 600,
        width:boundsSetting.width,
        autoHideMenuBar: true,
        minHeight: 600,
        height:boundsSetting.height,
        x: boundsSetting.x ,
        y: boundsSetting.y,
        acceptFirstMouse: true,
        maximizable: false,
        visualEffectState: 'active',
        //alwaysOnTop: true,
        webPreferences: {
          preload:path.join(__dirname, '/pages/group/imPreload.js'),
          nodeIntegration: false,
          contextIsolation: false,
          additionalArguments: [
            '--user-data-path=' + userDataPath,
            '--app-version=' + app.getVersion(),
            '--app-name=' + app.getName(),
            ...((isDevelopmentMode ? ['--development-mode'] : [])),
          ]
        }
      })
      groupIMWindow.on('resized',()=>{
        settings.set('groupWindowBounds',groupIMWindow.getBounds())
      })
      groupIMWindow.on('moved',()=>{
        settings.set('groupWindowBounds',groupIMWindow.getBounds())
      })
      groupIMWindow.setMenu(null)
      let im_url=''
      const { config } = require(path.join(__dirname, '//server-config.js'))
      if(isDevelopmentMode){
         im_url=config.IM.FRONT_URL_DEV + config.IM.AUTO_LOGIN
      }else{
         im_url=config.IM.FRONT_URL + config.IM.AUTO_LOGIN
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
  ipc.on('navigateToAccount', (event, args) => {
    if(groupIMWindow) {
      const { config, api } = require(path.join(__dirname, '//server-config.js'))
      sendIPCToWindow(mainWindow,'tab-navigateToAccount', {url: config.SERVER_BASE_URL + api.API_URL.user.USER_ACCOUNT})
      groupIMWindow.close()
    }
  })
})
