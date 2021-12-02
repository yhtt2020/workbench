let siteCardWindow=null
function createSiteCardWin(url,pos,title,tabData){
  if (siteCardWindow === null) {
    siteCardWindow = new BrowserWindow({
      frame: true,
      backgroundColor: 'white',
      parent: mainWindow,
      modal: false,
      hasShadow: true,
      width: 480,
      autoHideMenuBar: true,
      height: 415,
      x:pos.x+mainWindow.getBounds().x,
      y:mainWindow.getBounds().y+40,
      resizable: false,
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
          '--site-url='+url,
          '--site-title='+title,
          '--tab-data='+  encodeURIComponent(JSON.stringify(tabData)),
          ...((isDevelopmentMode ? ['--development-mode'] : [])),
        ]
      }
    })
    siteCardWindow.webContents.loadURL('file://' + __dirname + '/pages/siteCard/index.html')
    //siteCardWindow.webContents.openDevTools()
    siteCardWindow.on('close', () => siteCardWindow = null)
    siteCardWindow.on('show', () => {
      siteCardWindow.focus()
    })
  } else {
    siteCardWindow.close()
    siteCardWindow = null
  }
}
ipc.on('createSiteCard',(event,args)=>{
  createSiteCardWin(args.url,{x:args.x,y:args.y},args.title,args.tabData)
})
app.whenReady().then(()=>{
  createSiteCardWin()
})
