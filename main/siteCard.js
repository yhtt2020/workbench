let siteCardWindow = null

function createSiteCardWin (args) {
  let { url, pos, title, tabData ,activeTab} = args
  // url:当前网页的url，完整的url
  // pos：展现坐标位置
  // title：窗口标题，站点名称
  // tabData：当前的tab对象
  if (siteCardWindow === null) {
    url=!!!url?tabData.url:url
    console.log(tabData)
    title=!!!title?tabData.title:title
    activeTab=!!!activeTab?'base':activeTab
    const siteUrl=parseInnerURL(url)
    if(!!!pos){
      pos = electron.screen.getCursorScreenPoint()
    }
    siteCardWindow = new BrowserWindow({
      frame: true,
      backgroundColor: 'white',
      parent: mainWindow,
      modal: false,
      hasShadow: true,
      minWidth: 600,
      width: 600,
      autoHideMenuBar: true,
      minHeight: 600,
      height: 600,
      x: pos.x ,
      y: pos.y +28,
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
          '--site-url=' + siteUrl,
          '--site-title=' + title,
          '--tab-data=' + encodeURIComponent(JSON.stringify(tabData)),
          '--active-tab='+activeTab,
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

ipc.on('createSiteCard', (event, args) => {
  createSiteCardWin({ url: args.url, pos:args.pos, title: args.title, tabData: args.tabData })
})
app.whenReady().then(() => {
  createSiteCardWin()
})

ipc.on('openPwdManager', (event, args) => {
  createSiteCardWin({ tabData: args.tabData ,activeTab:'pwd'})
})

function parseInnerURL(url){
  if(url.startsWith('file://')){
    try {
      var pageName = url.match(/\/pages\/([a-zA-Z]+)\//)
      var urlObj = new URL(url)
      if (pageName) {
        return 'ts://' + pageName[1] + urlObj.search
      }
    } catch (e) {}
  }else{
    return url
  }

}
