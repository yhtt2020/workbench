class Win {
  win
  url
  width
  height
  resizable
  extraData
  alwaysTop
  callerId

  constructor () {
    let config = {}
    config.maximizable = true
    config.resizable = true
    config.show = false
    this.win = new BrowserWindow(config)
    this.initEvent()
    this.win.loadURL('/blank')
    this.url = '/blank'
    //protocol.load(this.win,'/blank')
  }

  async use (param, callerId) {
    this.url = param.url
    this.width = param.width
    this.height = param.height
    this.resizable = param.resizable
    this.extraData = param.extraData
    this.alwaysTop = param.alwaysTop
    this.callerId = callerId
    this.win.loadURL(this.url)
    this.win.setSize(this.width, this.height)
    this.win.setAlwaysOnTop(!!this.alwaysTop)
    this.win.center()
    this.win.show()
  }

  initEvent () {
    this.win.on('close', () => {
      let index = pool.dic.findIndex(v => v.url === this.url)
      pool.dic.splice(index, 1)
    })
    this.win.on('maximize', () => {
      this.win.webContents.send('windowMaximized')
    })
    this.win.on('unmaximize', () => {
      this.win.webContents.send('windowUnmaximize')
    })
  }
}

const PopCacheTime = 300000 //弹窗缓存时长，默认为30秒，期间只会隐藏，而不会直接关闭
class Pop {
  id
  win
  args
  callerId //呼叫这个pop的调取者的windowId，用于直发消息
  constructor () {
    let config = {}
    config.frame = false
    config.show = false
    config.resizable=false
    config.skipTaskbar = true
    config.webPreferences = {
      nodeIntegration: true,
      contextIsolation: false,
      sandbox: false,
      webSecurity: false,
      nodeIntegrationInWorker: true, // used by ProcessSpawner
      additionalArguments: [
        '--user-data-path=' + userDataPath,
        '--app-version=' + app.getVersion(),
        '--app-name=' + app.getName(),
        ...((isDevelopmentMode ? ['--development-mode'] : [])),
      ]
    }
    this.win = new BrowserWindow(config)
    this.initEvent()
    this.win.loadURL('/blank')
    this.id = this.win.webContents.id
    this.url = '/blank'
  }

  initEvent () {
    this.win.on('close', () => {
      let index = pool.pop.findIndex(v => v.url === this.url)
      pool.pop.splice(index, 1)
    })
    this.win.on('blur', () => {
      // this.win.hide()
      // //缓存1分钟，超过1分钟再自动关闭
      // setTimeout(() => {
      //   if (!this.win.isDestroyed()) {
      //     if (!this.win.isVisible()) {
      //       this.win.close()
      //       return
      //     }
      //   }
      // }, PopCacheTime)
    })
    this.win.on('maximize', () => {
      this.win.webContents.send('windowMaximized')
    })
    this.win.on('unmaximize', () => {
      this.win.webContents.send('windowUnmaximize')
    })

    this.win.on('show', () => {
      this.win.webContents.send('show')
    })
  }

  async use (param, callerId) {
    this.url = param.url
    this.width = param.width
    this.callerId = callerId
    this.args = param.args || {}
    this.x = param.x
    this.y = param.y
    this.height = param.height
    this.resizable = param.resizable
    this.extraData = param.extraData
    this.alwaysTop = param.alwaysTop
    this.win.loadURL(this.url)
    this.win.setSize(this.width, this.height)
    this.win.setPosition(this.x, this.y)
    this.win.setAlwaysOnTop(!!this.alwaysTop)
    this.win.show()
  }
}

class Pool {
  dic = []
  pop = []

  async init () {
    this.dic.push(new Win())
    this.pop.push(new Pop())
  }

  constructor () {
    ipc.handle('loadWindow', async (e, param) => {
      await this.use(param)
    })
    ipc.handle('getPopCallerId', (e, param) => {
      return pool.getPop(e.sender.id).callerId
    })
    ipc.handle('getPopArgs', (e, param) => {
      return pool.getPop(e.sender.id).args
    })
  }

  /**
   * 获得当前存在的Pop
   * @returns {*}
   * @param id
   */
  getPop (id) {
    return this.pop.find(v => v.id === id)
  }

  async use (param, callerId) {
    let oldObj = this.dic.find(v => v.url === param.url)
    if (oldObj) {
      oldObj.callerId = callerId
      oldObj.win.show()
      oldObj.win.moveTop()
      return
    }
    let blankObj = this.dic.find(v => v.url === '/blank')
    await blankObj.use(param, callerId)
    this.dic.splice(0, 0, new Win())
  }

  async usePop (param, callerId = -1) {
    if(param.bounds){
      param=Object.assign(param,param.bounds)
    }
    let oldObj = this.pop.find(v => v.url === param.url)
    if (oldObj) {
      oldObj.callerId = callerId
      oldObj.win.show()
      oldObj.win.moveTop()
      return oldObj
    }
    let blankObj = this.pop.find(v => v.url === '/blank')
    await blankObj.use(param, callerId)
    this.pop.push(new Pop())
    return blankObj
  }
}

let pool = new Pool()
app.whenReady().then(() => {
  pool.init()
})

// const renderPopManager={
//   /**
//    * 准备窗体
//    */
//   preparePop (name = Date.now().toString(), url, options = {}, webPreferences = {},fileOption) {
//     if (popRegistered.indexOf(name) === -1) {
//       return false //如果不在注册的弹窗清单中，则直接返回假
//     }
//     let popWindow = popManager.get(name)
//     if (popWindow) {
//       return popWindow
//     }
//     options = Object.assign({
//       width: 800,
//       height: 600,
//       acceptFirstMouse: true,
//       alwaysOnTop: true,
//       show: false,
//       //resizable: false,  //必须设置为resizeable，无法resize的窗体在window上无边框和阴影
//       frame: false,
//       webPreferences: webPreferences
//     }, options)
//     webPreferences = Object.assign({
//       //preload: __dirname+'/pages/saApp/settingPreload.js',
//       nodeIntegration: true,
//       contextIsolation: false,
//       enableRemoteModule: true,
//       sandbox: false,
//       safeDialogs: false,
//       safeDialogsMessage: false,
//       partition: null,
//       webSecurity:false,
//       additionalArguments: [
//         '--user-data-path=' + userDataPath,
//         '--app-version=' + app.getVersion(),
//         '--app-name=' + app.getName()
//       ]
//     }, webPreferences)
//     options.webPreferences = webPreferences
//     let pop = new BrowserWindow(options)
//     if(url.startsWith('http') || url.startsWith('https')){
//       pop.loadURL(url)
//     }else{
//       pop.loadFile(url,fileOption)
//     }
//     pop.on('blur', () => {
//       pop.hide()
//     })
//     pop.on('will-resize',(event)=>{
//       event.preventDefault()
//     })
//     popWindow = {
//       name: name,
//       window: pop,
//       /**
//        * 设置窗体Bounds，如果窗体不存在，则返回false
//        * @param bounds {width,height,x,y}
//        */
//       setBounds (bounds) {
//         popWindow.window.setBounds(bounds)
//       }
//     }
//
//     popList.push(popWindow)
//     return popWindow
//   },
//   /**
//    * 根据窗体名称创建窗体
//    * @param name
//    * @returns {boolean|*}
//    */
//   get (name) {
//     let find = popList.find(item => {
//       if (item.name === name)
//         return item
//     })
//     if (find) {
//       return find
//     } else {
//       return false
//     }
//   },
//   /**
//    * 使用管理器进行bounds设置，设置窗体的bounds。如果本身就已经获取到了popWindow对象，建议直接使用此对象的setBounds
//    * @param name  名称
//    * @param bounds  bounds
//    * @returns {boolean}
//    */
//   setBounds (name, bounds) {
//     let popWindow = popManager.get(name)
//     if (popWindow) {
//       popWindow.setBounds(bounds)
//       return popWindow
//     } else {
//       return false
//     }
//   },
//   /**
//    * 根据条件自动创建一个窗体，基于name去重，如果已经存在预热过的窗体，则直接返回。
//    * @param name 名称
//    * @param url url
//    * @param options 窗体options
//    * @param webPreferences
//    * @returns {BrowserWindow}
//    */
//   openPop (name = Date.now().toString(), url, options = {}, webPreferences = {},fileOptions) {
//     let popWindow = popManager.preparePop(name, url, options, webPreferences,fileOptions)
//     if (popWindow) {
//       popWindow.window.show()
//       return popWindow
//     } else {
//       throw new Error('未注册的pop，不可直接使用，请到popManager中手动注册后使用。')
//     }
//   }
// }

const render = {
  renderWindows: [],//渲染窗体
  renderPopups: [],//渲染弹窗
  /**
   * 获得一个url，调试环境下，返回vite调试协议路径，正式环境下，返回tsbapp协议地址
   * @param url
   * @returns {string}
   */
  getUrl (url) {
    let protocolUrl
    if (isDevelopmentMode) {
      protocolUrl = `http://localhost:1600/${url}`
    } else {
      protocolUrl = `tsbapp://./${url}` //todo 需要验证正式环境的协议情况
    }
    return protocolUrl
  },
  init () {
    app.on('ready', () => {
      let regStats = protocol.registerBufferProtocol('tsbapp', (request, response) => {
        this.regDefaultProtocol(request, response)
      })
      if (regStats) {

      } else {
        console.log('注册协议失败')
      }
      ipc.on('addRenderTab', (event, args) => {
        this.openRenderTab(args.url)
      })
      ipc.on('closeSelf',(event,args)=>{
        BrowserWindow.fromWebContents(event.sender).close()
      })
    })

  },
  regDefaultProtocol (request, response) {
    let pathName = new URL(request.url).pathname
    let extension = path.extname(pathName).toLowerCase()
    if (!extension) return
    pathName = decodeURI(pathName)
    let filePath = path.join(__dirname, 'vite', 'dist', pathName)
    fs.readFile(filePath, (error, data) => {
      if (error) return
      let mimeType = ''
      if (extension === '.js') {
        mimeType = 'text/javascript'
      } else if (extension === '.html') {
        mimeType = 'text/html'
      } else if (extension === '.css') {
        mimeType = 'text/css'
      } else if (extension === '.svg') {
        mimeType = 'image/svg+xml'
      } else if (extension === '.json') {
        mimeType = 'application/json'
      }
      response({ mimeType, data })
    })
  },
  /**
   * 打开一个渲染tab
   * @param url
   */
  openRenderTab (url) {
    let realUrl = this.getUrl(url)
    sendIPCToWindow(mainWindow, 'addTab', { url: realUrl })
  },
  openRenderWindow (url, windowArgs, webPreferences) {
    const defaultWebPreferences = {
      nodeIntegration: true,
      contextIsolation: false,
      nodeIntegrationInWorker: true, // used by ProcessSpawner
      additionalArguments: [
        '--user-data-path=' + userDataPath,
        '--app-version=' + app.getVersion(),
        '--app-name=' + app.getName(),
        ...((isDevelopmentMode ? ['--development-mode'] : [])),
      ]
    }
    let webP = Object.assign(defaultWebPreferences, webPreferences)
    const defaultWindowArgs = {
      width: 800,
      height: 800,
      backgroundColor: '#fff',//backgroundColor: '#fff', // the value of this is ignored, but setting it seems to work around https://github.com/electron/electron/issues/10559
      webPreferences: webP,
      show: false
    }
    let windowA = Object.assign(defaultWindowArgs, windowArgs)
    let win = new BrowserWindow(windowA)
    win.on('ready-to-show', () => {
      win.show()
    })
    win.loadURL(this.getUrl(url))
    this.renderWindows.push(win)
    return win
  }
}

const renderPage = {
  iconSelector: null, //图标选择器
  installExtension: null, //安装插件
  init () {

  },
  /**
   * 启动图片选择器
   * @param pos 位置
   * @param windowId 启动者的WebContents的id，用于渲染进程获取交互句柄
   */
  openIconSelector (pos, windowId) {
    pool.usePop({
      url: render.getUrl('icon.html'),
      width: 390,
      height: 320,
      x: pos.x,
      y: pos.y,
    }, windowId).then()
  },
  openInstallExtension (args) {
    let pos = renderPage.getMainWindowCenterBounds(448, 300)
    pool.usePop({
      url: render.getUrl('extension.html#/install'),
      width: pos.width,
      height: pos.height,
      x: pos.x,
      y: pos.y,
      args: {
        manifest: { ...args.manifest },
        id: args.crxInfo.id,
        crxInfo:args.crxInfo,
        manifestPath:args.manifestPath
      }
    }).then()
  },
  getMainWindowCenterBounds (width, height) {
    let mainBounds = mainWindow.getBounds()
    let x = parseInt(mainBounds.x + (mainBounds.width - width) / 2)
    let y = parseInt(mainBounds.y + (mainBounds.height - height) / 2)
    return { x, y, width, height }
  },
  openExtensionPopList(){
    let bounds= renderPage.getMainWindowCenterBounds(350,500)
    pool.usePop({
      url:render.getUrl('extension.html#/pop'),
      bounds
    })
  }
}

render.init()
