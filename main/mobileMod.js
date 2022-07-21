let mobileViews = {}
let mobileWindows = {}
let mobileCount = 0
const initSize = {
  width: 480,
  height: 800
}
const mobileMod = {

  getPos () {
    const space=10
    const { screen } = require('electron')
    const maxWidth=screen.getPrimaryDisplay().workAreaSize.width
    const sourcePoint = {
      x: mainWindow.getBounds().x + 300,
      y: mainWindow.getBounds().y + 300
    }
    if (sourcePoint.x + (mobileCount+1) * initSize.width < maxWidth) {
      return {x:sourcePoint.x + mobileCount * (initSize.width+space),y:sourcePoint.y}
    }else{
      return {x:sourcePoint.x+ mobileCount * space,y: sourcePoint.y + mobileCount * space }
    }

  },
  add (mobileUrl) {
    let id = ''
    do {
      id = String(Math.floor((Math.random() * 10000) + 1))
    } while (typeof mobileViews[id] !== 'undefined')
    const pos= mobileMod.getPos()
    let mobileWindow = new BrowserWindow({
      frame: true,
      backgroundColor: 'white',
      modal: false,
      hasShadow: true,
      x: pos.x,
      y: pos.y,
      width: initSize.width,
      autoHideMenuBar: true,
      height: initSize.height,
      resizable: true,
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
          ...((isDevelopmentMode ? ['--development-mode'] : [])),
        ]
      }
    })
    let view = new BrowserView({
      width: initSize.width,
      height: initSize.height - 70,
      webPreferences:{
        nodeIntegration: false,
        nodeIntegrationInSubFrames: true,
        scrollBounce: true,
        safeDialogs: true,
        safeDialogsMessage: '阻止此页面弹窗',
        preload: __dirname + '/dist/preload.js',
        contextIsolation: true,
        sandbox: true,
        enableRemoteModule: false,
        allowPopups: false,
        partition: 'persist:webcontent',
        enableWebSQL: false,
        autoplayPolicy: (settings.get('enableAutoplay') ? 'no-user-gesture-required' : 'user-gesture-required'),
        // partition:'persist:webcontent',
        // preload: path.join(__dirname, '/dist/preload.js'),
        // additionalArguments: [
        //   '--user-data-path=' + userDataPath,
        //   '--app-version=' + app.getVersion(),
        //   '--app-name=' + app.getName(),
        //   ...((isDevelopmentMode ? ['--development-mode'] : [])),
        // ]
      }
    })
    console.log(path.join(__dirname, '/dist/preload.js'))
    mobileWindow.setBrowserView(view)
    view.setBounds({
      x: 0,
      y: 40,
      width: mobileWindow.getBounds().width,
      height: mobileWindow.getBounds().height - 70
    })
    mobileWindow.webContents.send('init', {
      windowId: mobileWindow.id,
      url: mobileUrl,
      id: id
    })
    view.webContents.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1')
    view.webContents.loadURL(mobileUrl)
    view.webContents.on('did-navigate-in-page', (event, url) => {
      mobileWindow.webContents.send('updateView', {
        url: url,
        canGoBack: view.webContents.canGoBack(),
        canGoForward: view.webContents.canGoForward()
      })
    })
    view.webContents.on('did-navigate', (event, url) => {
      mobileWindow.webContents.send('updateView', {
        url: url,
        canGoBack: view.webContents.canGoBack(),
        canGoForward: view.webContents.canGoForward()
      })
    })
    view.webContents.on('new-window', (event, url) => {
      event.preventDefault()
      view.webContents.loadURL(url)
      mobileWindow.webContents.send('updateView', {
        url: url,
        canGoBack: view.webContents.canGoBack(),
        canGoForward: view.webContents.canGoForward()
      })
    })

    mobileWindow.webContents.setUserAgent(oldAgent)
    mobileWindow.loadURL('file://' + __dirname + '/pages/mobile/index.html')
    mobileWindow.on('resize', () => {
      view.setBounds({
        x: 0,
        y: 40,
        width: mobileWindow.getBounds().width,
        height: mobileWindow.getBounds().height - 70
      })
    })

    mobileWindow.on('closed', () => {
      mobileViews[id] = undefined
      mobileWindows[id] = undefined
      delete mobileViews[id]
      mobileCount--
    })

    mobileViews[id] = view
    mobileWindows[id] = mobileWindow
    mobileCount++
// var view=viewMap[data.id]
// var index=emulationViews.indexOf(data.id)
// if(index!=-1){
// 	view.webContents.setUserAgent(oldAgent)
// 	view.webContents.disableDeviceEmulation()
// 	view.webContents.reload()
// 	emulationViews.splice(index,1)
//
// }else{
// 	oldAgent=view.webContents.getUserAgent()
// 	view.setBackgroundColor("#d1d1d1")
// 	view.webContents.setUserAgent('Mozilla/5.0 (iPad; CPU OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A403 Safari/8536.25')
// 	view.webContents.enableDeviceEmulation({
// 		 screenPosition: 'mobile',
// 		 screenSize: { width: 480, height: 812 },
// 		 deviceScaleFactor: 0,
// 		 viewPosition: { x: 10, y: 0 },
// 		 viewSize: { width: 600, height: 812 },
// 		 fitToView: false,
// 		 offset: { x: 10, y: 0 }
// 	})
//
// 	emulationViews.push(data.id)
// 	view.webContents.reload()
// }

// view.webContents.openDevTools({
// 	 mode: 'bottom'
// })
  }

}

app.whenReady().then(() => {
  ipc.on('mobileGoBack', (event, args) => {
    mobileViews[args.id].webContents.goBack()
  })

  ipc.on('mobileGoForward', (event, args) => {
    mobileViews[args.id].webContents.goForward()
  })

  ipc.on('mobileRefresh', (event, args) => {
    mobileViews[args.id].webContents.reload()
  })

  ipc.on('mobileResetSize', (event, args) => {
    console.log(mobileWindows[args.id])
    mobileWindows[args.id].setSize(initSize.width, initSize.height)
  })
})

module.exports = mobileMod
