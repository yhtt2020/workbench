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
      center:true,
      hasShadow: true,
      minWidth: 600,
      width: 600,
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
          '--site-url=' + siteUrl,
          '--site-title=' + title,
          '--tab-data=' + encodeURIComponent(JSON.stringify(tabData)),
          '--active-tab='+activeTab,
          ...((isDevelopmentMode ? ['--development-mode'] : [])),
        ]
      }
    })
    var parent_x = mainWindow.getPosition()[0]
    var parent_y = mainWindow.getPosition()[1]
    var parent_size_x = mainWindow.getSize()[0]
    var parent_size_y = mainWindow.getSize()[1]
    var siteCardWindow_size_x = siteCardWindow.getSize()[0]
    var siteCardWindow_size_y = siteCardWindow.getSize()[1]
    var siteCardWindows_new_x = parent_x + (parent_size_x - siteCardWindow_size_x) / 2
    var siteCardWindow_new_y = parent_y + (parent_size_y - siteCardWindow_size_y) / 2
    siteCardWindow.setPosition(parseInt(siteCardWindows_new_x), parseInt(siteCardWindow_new_y), false)

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
  //createSiteCardWin() 启动的时候不自动创建sitecard
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
