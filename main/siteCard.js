let siteCardWindow = null

function createSiteCardWin (args) {
  let { url, pos, title, tabData, activeTab } = args
  // url:当前网页的url，完整的url
  // pos：展现坐标位置
  // title：窗口标题，站点名称
  // tabData：当前的tab对象
  if (siteCardWindow === null) {
    url = !url ? tabData.url : url
    title = !title ? tabData.title : title
    activeTab = !activeTab ? 'base' : activeTab
    const siteUrl = parseInnerURL(url)
    if (siteUrl.startsWith('ts://')) {
      return // 禁止内部页面打开卡片
    }
    if (!pos) {
      pos = electron.screen.getCursorScreenPoint()
    }
    siteCardWindow = new BrowserWindow({
      frame: true,
      backgroundColor: 'white',
      parent: mainWindow,
      center: true,
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
        sandbox: false,
        additionalArguments: [
          '--user-data-path=' + userDataPath,
          '--app-version=' + app.getVersion(),
          '--app-name=' + app.getName(),
          '--site-url=' + siteUrl,
          '--site-title=' + title,
          '--tab-data=' + encodeURIComponent(JSON.stringify(tabData)),
          '--active-tab=' + activeTab,
          ...((isDevelopmentMode ? ['--development-mode'] : []))
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
    // siteCardWindow.webContents.openDevTools()
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
  createSiteCardWin({ url: args.url, pos: args.pos, title: args.title, tabData: args.tabData })
})
app.whenReady().then(() => {
  // createSiteCardWin() 启动的时候不自动创建sitecard
})
let currentPwdTab={}
ipc.handle('getPwdTab',(event,args)=>{
  return currentPwdTab
})


async function openPwdManager (args) {
  if (!args.tabData) {
    let promise = new Promise(resolve => {
      ipc.once('gotCurrentTab', (e, arg) => {
        resolve(arg.data)
      })
    })
    sendIPCToWindow(mainWindow, 'getCurrentTab')
    args.tabData = await promise
  }
  const url = args.tabData.url
  const title = args.tabData.title
  const siteUrl = parseInnerURL(url)
  currentPwdTab = args.tabData

  if (!global.passwordWin) {
    const parentBounds = mainWindow.getBounds()
    if (args.uuid && args.target) {
      var p = `/${encodeURIComponent(args.uuid)}/${args.target}`
    } else {
      p = ''
    }
    let url = render.getUrl('kee.html#/passwords/value/' + encodeURIComponent(siteUrl) + '/type/url' + p)
    if(args.route){
      url=render.getUrl(args.route)
    }
    let pos={}
  if(args.pos){
    pos={
      x: parentBounds.x + parentBounds.width - 610, // todo 后面要做个工具方法，统一实现计算弹窗位置
      y: args.pos.y + parentBounds.y + 10,
    }
  }




    global.passwordWin = await windowManager.create({
      url: url,
      name: 'kee',
      rememberBounds: true,
      defaultBounds: {
        width: 600,
        height: 453,
      },
      windowOption: {
        backgroundColor: 'white',
        parent: mainWindow,
        ...pos,
        hasShadow: true,
        minWidth: 600,
        frame:true,
        autoHideMenuBar: true,
        minHeight: 453,
        acceptFirstMouse: true,
        maximizable: false,
        visualEffectState: 'active',
        alwaysOnTop: true
      },
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        sandbox: false,
        webSecurity: false,
        preload: ___dirname + '/src/preload/keePreload.js',
        additionalArguments: [
          '--site-url=' + siteUrl,
          '--site-title=' + title,
        ]
      }
    })
    // passwordWin.window.on('blur',()=>{
    //   passwordWin.close()
    //   passwordWin=null
    // })
    passwordWin.window.on('close',()=>{
      passwordWin=null
    })
  } else {
    global.passwordWin.close()
    global.passwordWin = null
  }
}
ipc.on('openPwdManager', async (event, args) => {
  return await openPwdManager(args)
})

//打开标签并填充密码
ipc.on('openTabFill',(event,args)=>{
  sendIPCToMainWindow('addTab',{
    url:'http://'+args.password.domain,
    password:args.password
  })
})
ipc.on('openSubTabFillClick',(event,args)=>{
  let newTab={
    url:'http://'+args.password.domain,
    password:args.password,
    partition:args.password.domain+'_'+args.password.username,
    newName:args.password.title || args.password.username}
  sendIPCToMainWindow('addTab',newTab)
})
ipc.on('fillPassword',(event,args)=>{
  sendIPCToMainWindow('fillPassword',{password:args.password})
})
ipc.on('changePwdDb',(event,args)=>{
   openPwdManager({
     route:'kee.html#/passwordBank'
   })
})

function parseInnerURL (url) {
  if (url.startsWith('file://')) {
    try {
      var pageName = url.match(/\/pages\/([a-zA-Z]+)\//)
      var urlObj = new URL(url)
      if (pageName) {
        return 'ts://' + pageName[1] + urlObj.search
      }
    } catch (e) {}
  } else {
    return url
  }
}
