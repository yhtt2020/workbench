const path = require('path')
const {WindowInstance, ViewInstance, FrameWindowInstance} = require('./instanceClass.js')
const {app, ipcMain: ipc, BrowserWindow, BrowserView} = require('electron')
global.ApiHandler = require('./apiHandler.js')
const SaApp = require('./saAppClass')
const remote = require('@electron/remote/main')
const SettingModel=require('../model/settingModel.js')
const _ = require('lodash')

let settingModel

class BrowserViewHandler{
  asyncCallbacks
  view
  static IPCEvents=[]
  id//id，webcontents的id
  constructor (props) {
    this.view=props.view
    this.id=props.view.webContents.id
  }
  callSync(method, argsOrCallback, callback){
    var args = argsOrCallback
    var cb = callback
    if (argsOrCallback instanceof Function && !cb) {
      args = []
      cb = argsOrCallback
    }
    if (!(args instanceof Array)) {
      args = [args]
    }
    if (cb) {
      var callId = Math.random()
      this.asyncCallbacks[callId] = cb
    }
    this.send('callViewMethod', { callId: callId, method: method, args: args })
  }
  send(event,args){
    console.log('发送ipc',event,args)
    this.view.webContents.send(event,args)
  }
  //监听app单独的IPC信道
  static listenIPC(){
    console.log('监听IPC')
    ipc.on('app.ipc',(event,args)=>{
      BrowserViewHandler.IPCEvents.forEach(e=>{
        if(e.id===event.sender.id && e.event===args.event){//找到发送者的id
          e.fn(args.id, [args.data], event.frameId, event.senderFrame.url)
        }
      })
    })
  }
  bindIPC(event,id,fn){
    BrowserViewHandler.IPCEvents.push({
      event,
      id:id,
      fn })
  }

  /**
   *
   */
  removeIPC(){
    console.log('清理前',BrowserViewHandler.IPCEvents)
    BrowserViewHandler.IPCEvents=BrowserViewHandler.IPCEvents.filter(e=>{
      return e.id!==this.id
    })
    console.log('清理后',BrowserViewHandler.IPCEvents)
  }

  ready(){
    this.view.webContents.on('destroyed',()=>{
      this.removeIPC()
    })
    // this.bindIPC('password-autofill',this.id, (tab, args, frameId, frameURL) =>{
    //   this.view.webContents.send('password-autofill',{id:this.id,args:{
    //       tab, args, frameId, frameURL
    //     }})
    // })

  }

}



/**
 * 代理view管理
 */
class ViewManager {
  asyncCallbacks=[]//事件回调
  SPLIT_WIDTH = 10
  bindedMainWindowEvent = false //是否已经绑定了主窗体事件
  lastWidth = 0 //最后一次调整的分体窗体的宽度

  autoAdjustPosition(pos, width) {
    if (!windowManager.attachedView) {
      return
    }
    let parentBounds = mainWindow.getBounds()
    let y = 0
    let out = false
    let outType = 'min' //max
    let noChange = false
    Object.keys(viewMap).forEach(key => {

      let view = viewMap[key]
      //let viewBounds = view.getBounds()
      //viewBounds是从viewManager主进程中直接获取
      if (viewMap[key] === windowManager.attachedView && Object.keys(viewMap).length > 1) {
        //如果是吸附到右侧的tab，且不是唯一的tab，则不需要实际去移动这个view
        return
      }
      let mainViewPreWidth = parentBounds.width - width - viewBounds.x - this.SPLIT_WIDTH //计算将要调整的宽度。用于限宽
      let maxViewWidth = parentBounds.width - viewBounds.x - this.SPLIT_WIDTH

      if (mainViewPreWidth <= 0) {
        //当发现预估宽度过小，则直接结束此次调整
        out = true
        outType = 'min'
      } else if (mainViewPreWidth > maxViewWidth) {
        out = true
        outType = 'max'
      }

      if (out) {
        if (outType === 'min' && viewBounds.width > 0) {
          mainViewPreWidth = 0
          width = parentBounds.width - viewBounds.x - this.SPLIT_WIDTH
        } else if (outType === 'max' && viewBounds.width < maxViewWidth) {
          mainViewPreWidth = maxViewWidth
        } else {
          noChange = true
          return false
        }
      }


      y = viewBounds.y
      let bounds = {
        x: viewBounds.x,
        y: viewBounds.y,
        width: mainViewPreWidth,
        height: viewBounds.height
      }
      sendIPCToMainWindow('showSplitBar', {bounds})
      view.setBounds(bounds)
    })
    let attachedViewBounds = windowManager.attachedView.getBounds()
    if (!noChange) {
      attachedViewBounds.width = width
      attachedViewBounds.x = parentBounds.width - width
      this.lastWidth = width
    }
    attachedViewBounds.y = viewBounds.y
    attachedViewBounds.height = viewBounds.height//修复attach的高度
    windowManager.attachedView.setBounds(attachedViewBounds)

    windowManager.attachStatus.bounds = attachedViewBounds
  }

  restore() {
    this.lastWidth = 0
    let parentBounds = mainWindow.getBounds()
    Object.keys(viewMap).forEach(key => {
      let view = viewMap[key]
      let bounds = {
        x: viewBounds.x,
        y: viewBounds.y,
        width: parentBounds.width,
        height: viewBounds.height
      }
      view.setBounds(bounds)
    })
  }

  /**
   * 鼠标拖动
   */
  resetAttachPosition() {
    let cursorPosition = require('electron').screen.getCursorScreenPoint()
    let parentBounds = mainWindow.getBounds()
    this.autoAdjustPosition('right', parentBounds.width + parentBounds.x - cursorPosition.x)
  }

  syncSize() {
    if (windowManager.attachedView) {
      this.autoAdjustPosition('right', this.lastWidth)
    }
  }

  /**
   * 当主进程中webviews被设置bounds的时候回调，如果存在attchedView则修正尺寸
   * @param bounds
   * @returns {*}
   */
  onSetBounds(bounds) {
    if (windowManager.attachedView) {
      if (mainWindow.getBrowserViews().indexOf(windowManager.attachedView) === -1) {
        //如果发现侧边吸附的view被移除了
        mainWindow.addBrowserView(windowManager.attachedView)
        this.syncSize()
      }
      bounds.width = bounds.width - this.lastWidth - this.SPLIT_WIDTH
    }
    return bounds
  }
}




/**
 * 窗口管理类，主要用于控制一些窗体，可以实现独立小窗体、吸附窗体。
 * 实现了事件绑定，可以在渲染进程自由绑定。
 */
class WindowManager {
  instanceMap = {} //name:instance

  windowMap = {} //name:window
  viewMap = {} //name:view
  webContentsMap = {} //name:webcontents
  windowStateMap = {} //name:{attach:false , }
  optionMap = {} //id: windowConfig:{} 如果为view,则为null ，当window转为attach的时候，为设置为null,webPreferences:{}

  attachedInstance = {} //已经吸附的窗体的实例
  attachedView = null//已经吸附的窗体
  attachStatus = null //{ name ,bounds, pos} //吸附窗体的状态
  stashCreateOptions = null//暂存的window的初始化设置

  viewManager = null

  constructor() {

    this.viewManager = new ViewManager()
    settingModel=new SettingModel()
    settingModel.initDb()
  }

  defaultViewPreferences = { //根据其定义的位置取用这里的width和height，在左右侧的话，只取用width，在上下，则只取height，目前仅支持width
    width: 480,
  }
  defaultWindowPreferences = {
    frame: false,
    hasShadow:true,
    show:false
  }
  defaultWebPreferences = {
    nodeIntegration: false,
    nodeIntegrationInSubFrames: true,
    scrollBounce: true,
    safeDialogs: true,
    safeDialogsMessage: '阻止此页面弹窗',
    preload: path.join(__dirname, 'src/browserApi/apiPreload.js'),
    contextIsolation: true,
    sandbox: true,
    backgroundColor: '#2e2c29',
    acceptFirstMouse: true,
    enableRemoteModule: false,
    allowPopups: false,
    // partition: partition || 'persist:webcontent',
    enableWebSQL: false,
    autoplayPolicy: ((settings.get('enableAutoplay') || settings.get('enableAutoplay') === undefined) ? 'no-user-gesture-required' : 'user-gesture-required'),
    // match Chrome's default for anti-fingerprinting purposes (Electron defaults to 0)
    minimumFontSize: 6
  }
  MOD = {
    WITH_CONTROLLER: 1,
    NO_CONTROLLER: 2,
    ATTACH: 3,
  }
  POS = {
    RIGHT: 'right'
  }

  /**
   * 是否存在窗体，存在则返回Instance，不存在则返回undefined
   * @param name
   * @returns {*}
   */
  isAlive(name) {
    return this.instanceMap[name] !== undefined
  }

  get(name) {
    return this.instanceMap[name]
  }

  close(name, destroy = true) {
    let instance = this.instanceMap[name]
    if (instance) {
      if (destroy) {
        instance.close()
      }
      //因为存在可能由于parent窗体被关闭导致被关闭的情况，实例的移除已经全部放到window或者webcontents移除的时候自动处理了。
      //this.ensureInstanceRemoved(instance.type,name)
    } else {
      throw 'instance不存在'
    }
  }

  /**
   * 确认并删除实例
   * @param type
   * @param name
   */
  ensureInstanceRemoved(type, name) {
    if (this[type + 'Map'][name]) {
      delete this[type + 'Map'][name]
    }
    if (this.instanceMap[name] && this.instanceMap[name].type === type) {
      //判断一下类型是否匹配，如果不匹配，可能是切换，而不是关闭，此时可能之后，则不需要移除
      delete this.instanceMap[name]
      if (this.webContentsMap[name]) {
        delete this.webContentsMap[name]
      }
    }

  }

  /**
   * name可以是字符串，也可以是时间戳，字符串一般用于经常用到的窗体，而时间戳则是临时窗体
   * @param options {mod,existingWindowId, name, webPreferences, boundsString, events,rememberBounds,url,defaultBounds}
   */
  async create (options) {
    let {
      mod,
      existingWindowId,
      name,
      windowOption,
      viewOption,
      webPreferences,
      boundsString,
      events,
      rememberBounds,
      defaultBounds,
      url
    } = options
    let webContents
    if (webPreferences)
      webPreferences =Object.assign( _.cloneDeep(this.defaultWebPreferences), webPreferences)
    this.optionMap[name] = name
    let instance

    windowOption.webPreferences = webPreferences
    windowOption = Object.assign(_.cloneDeep(this.defaultWindowPreferences), windowOption)
    windowOption.webPreferences.additionalArguments = [
      '--user-data-path=' + userDataPath,
      '--app-version=' + app.getVersion(),
      '--app-name=' + app.getName(),
      ...((isDevelopmentMode ? ['--development-mode'] : [])),
      '--name=' + name
    ]
    let window = new BrowserWindow(windowOption)
    window.once('ready-to-show', () => {
      if (options.onReadyToShow) {
        options.onReadyToShow(window)
      }
      window.show()
    })

    if (process.platform === 'darwin' && windowOption.frame===false) {
      //mac上设置隐藏交通灯按钮
      window.setWindowButtonVisibility(false)
    }
    if (rememberBounds) {
      await this.bindRememberBoundsEvents(name,window,defaultBounds)
    }


    window.on('closed', () => {
      this.ensureInstanceRemoved('window', name)
    })
    webContents = window.webContents

    if (url) {
      window.loadURL(url)
    }
    //window.webContents.openDevTools()
    this.windowMap[name] = window
    instance = new WindowInstance({
      window: window,
      createOptions: options,
      name: name,
      viewHandler:new BrowserViewHandler({view:window})
    })

    instance.viewHandler.ready()



    this.instanceMap[name] = instance
    this.webContentsMap[name] = webContents
    return instance
  }

  /**绑定记忆外框事件
   *
   * @param name
   * @param window
   */
  async bindRememberBoundsEvents (name, window,defaultBounds) {
    window.on('resized', async () => {
      await WindowManager.setBoundsSetting(name, window.getBounds())
    })
    window.on('moved', async () => {
      await WindowManager.setBoundsSetting(name, window.getBounds())
    })
    window.on('always-on-top-changed', async (e, isAlwaysOnTop) => {
      await WindowManager.setSettings(name, 'alwaysOnTop', isAlwaysOnTop)
    })

      let boundsSetting = await WindowManager.getBoundsSetting(name)
      let alwaysOnTop = await WindowManager.getSettings(name, 'alwaysOnTop')
      if (alwaysOnTop) {
        window.setAlwaysOnTop(alwaysOnTop)
      }
    defaultBounds.width=Number(defaultBounds.width)
    defaultBounds.height=Number(defaultBounds.height)
      if (boundsSetting) {
        window.setBounds(boundsSetting)
      }else{
        window.setBounds(defaultBounds)
      }

  }

  /**创建带外框的窗体
   *
   * @param options
   */
  async createFrameWindow(options) {
    let {
      name,
      url,
      app,
      windowOption,
      frameWebPreferences,
      viewWebPreferences,
      rememberBounds,
      onReadyToShow,//读入事件
      defaultBounds,
      onDomReady
    } = options
    frameWebPreferences =Object.assign( _.cloneDeep(this.defaultWebPreferences), frameWebPreferences)
    frameWebPreferences.webSecurity=false
    if (frameWebPreferences) {
      windowOption.webPreferences = frameWebPreferences
    }

    windowOption =  Object.assign(_.cloneDeep(this.defaultWindowPreferences), windowOption)
    let appWindow = new BrowserWindow(windowOption)
    appWindow.on('ready-to-show', () => {
      if (onReadyToShow) {
        onReadyToShow(appWindow)
      }
    })
    if (windowOption.alwaysOnTop) {
      appWindow.setAlwaysOnTop(true, 'screen-saver')
    }

    let windowId = appWindow.webContents.id

    appWindow.setMenu(null)

    appWindow.webContents.loadURL(render.getUrl('frame.html'))

    // if (process.platform !== 'darwin') {
    //   appWindow.setMenuBarVisibility(false)
    // }
    viewWebPreferences.additionalArguments.push('--name=' + name)
    let appView = windowManager.createFrameView({
      width: appWindow.getBounds().width,
      height: appWindow.getBounds().height - 70,
      url,
      name,
      webPreferences: viewWebPreferences,
      onDomReady
    })

    appWindow.setBrowserView(appView)

    const titleBarHeight = 30
    if (rememberBounds) {
      await this.bindRememberBoundsEvents(name, appWindow,defaultBounds)
    }
    appView.setBounds({
      x: 0,
      y: titleBarHeight,
      width: appWindow.getBounds().width,
      height: appWindow.getBounds().height - titleBarHeight
    })
    // appWindow.webContents.on('ipc-message', function (e, channel, data) {
    //   mainWindow.webContents.send('view-ipc', {
    //     name: channel,
    //     data: data,
    //     frameId: e.frameId
    //   })
    // })


    appWindow.on('resize', (event, args) => {
      appView.setBounds({
        x: 0,
        y: titleBarHeight,
        width: appWindow.getBounds().width,
        height: appWindow.getBounds().height - titleBarHeight
      })
    })
    appWindow.webContents.on('before-input-event', (event, input) => {
      if (process.platform === 'darwin') {
        if (input.meta && input.key.toLowerCase() === 'w') {
          appWindow.close()
          event.preventDefault()
        }
        if (input.meta && input.key.toLowerCase() === 'f') {
          appView.webContents.send('findInPage')
          event.preventDefault()
        }
      } else if (process.platform === 'win32') {
        if (input.control && input.key.toLowerCase() === 'w') {
          appWindow.close()
          event.preventDefault()
        }
        if (input.control && input.key.toLowerCase() === 'f') {
          appView.webContents.send('findInPage')
          event.preventDefault()
        }
      }
      //todo 判断linux
    })

    /**
     * 只允许通过关闭按钮隐藏，而不是彻底关闭
     */
    appWindow.on('enter-full-screen', () => {
      appView.setBounds({
        x: 0,
        y: 0,
        width: appWindow.getBounds().width,
        height: appWindow.getBounds().height
      })
      appWindow.webContents.send('enter-full-screen')
    })
    appWindow.on('leave-full-screen', () => {
      appView.setBounds({
        x: 0,
        y: titleBarHeight,
        width: appWindow.getBounds().width,
        height: appWindow.getBounds().height - titleBarHeight
      })
      appWindow.webContents.send('leave-full-screen')
    })

    appWindow.on('maximize', () => {

      appWindow.webContents.send('maximize')
    })
    appWindow.on('unmaximize', () => {
      appWindow.webContents.send('unmaximize')
    })


    appWindow.view = appView

    this.windowMap[name] = appWindow
    this.instanceMap[name] = new FrameWindowInstance({
      frame: appWindow,
      view: appWindow.view,
      createOptions: options,
      name: name,
      viewHandler:new BrowserViewHandler({view:appWindow.view}),
      app
    })
    this.instanceMap[name].viewHandler.ready()
    this.webContentsMap[name] = appView.webContents
    return {
      frame: appWindow,
      view: appWindow.view,
      windowId,
      app
    }
  }

  createFrameView(options, frameWindow) {
    let {
      webPreferences,
      width,
      height,
      name,
      url: loadUrl,
      onDomReady
    } = options

    let appView = new BrowserView({
      width,
      height,
      webPreferences: webPreferences
    })
    appView.setBackgroundColor('#ffffff')

    remote.enable(appView.webContents)

    function updateView(url) {
      if (frameWindow.isFocused()) {
        //发送弹幕更新ipc
        if (barrageManager)
          barrageManager.changeUrl(url)
      }
      frameWindow.webContents.send('updateView', {
        url: url,
        canGoBack: appView.webContents.canGoBack(),
        canGoForward: appView.webContents.canGoForward()
      })
    }

    appView.webContents.on('did-navigate-in-page', (event, url) => {
        if (frameWindow) {
          if (!frameWindow.webContents.isDestroyed())
            updateView(url)
        }
      }
    )


    appView.webContents.on('new-window', (event, url, frameName, disposition, options, additionalFeatures, referrer, postBody) => {

      sendIPCToMainWindow('addTab', {url: url})
      event.preventDefault()
      //todo 考虑如何处理应用内的网页打开

      // if (!!!saApp.openNewWindow || saApp.openNewWindow === 'redirect') {
      //   //默认为重定向
      //   event.preventDefault()
      //   appView.webContents.loadURL(url)
      //   updateView(url)
      // } else if (saApp.openNewWindow === 'allow') {
      //   event.preventDefault()
      //   //允许，则不修改默认事件
      //   const win = new BrowserWindow({
      //     webContents: options.webContents, // use existing webContents if provided
      //     show: false
      //   })
      //   win.webContents.on('new-window', (event, url) => {
      //     event.preventDefault()
      //     win.webContents.loadURL(url)
      //   })
      //   win.once('ready-to-show', () => win.show())
      //   win.setMenu(null)
      //   if (!options.webContents) {
      //     const loadOptions = {
      //       httpReferrer: referrer
      //     }
      //     if (postBody != null) {
      //       const { data, contentType, boundary } = postBody
      //       loadOptions.postData = postBody.data
      //       loadOptions.extraHeaders = `content-type: ${contentType}; boundary=${boundary}`
      //     }
      //     win.loadURL(url, loadOptions)
      //   }
      //   event.newGuest = win
      // } else if (saApp.openNewWindow === 'deny') {
      //   //禁止打开
      //   event.preventDefault()
      // }
    })

    appView.webContents.once('dom-ready', () => {
      if (onDomReady) {
        onDomReady()
      }
    })

    appView.webContents.on('before-input-event', (event, input) => {
      let keyCtrlOrMeta
      if (process.platform === 'darwin') {
        keyCtrlOrMeta = input.meta
      } else {
        keyCtrlOrMeta = input.control
      }
      if (keyCtrlOrMeta && input.key.toLowerCase() === 'w') {
        windowManager.close(name)
        //frameWindow.close()
        event.preventDefault()
      } else if (keyCtrlOrMeta && input.key.toLowerCase() === 'f') {
        appView.webContents.send('findInPage')
        event.preventDefault()
      } else if (input.key.toLowerCase() === 'f12') {
        appView.webContents.openDevTools({
          mode: 'detach'
        })
        //todo 想办法增加devtool的新菜单打开的事件，目前没有好办法
        event.preventDefault()
      }
      // console.log('press'+input)
      //todo 判断linux
    })
    appView.webContents.loadURL(loadUrl)



    return appView
  }


  createView(options) {
    let {
      name,
      viewOption,
      webPreferences,
      rememberBounds,
      defaultBounds,
      url
    } = options
    let webContents
    if (!webPreferences) {
      webPreferences = {}
    }
    webPreferences = Object.assign(this.defaultWebPreferences, webPreferences)
    this.optionMap[name] = name
    let wenContents
    let instance
    if (!viewOption) {
      viewOption = {}
    }
    viewOption.windowOption = Object.assign(this.defaultViewPreferences, viewOption)
    if(!webPreferences.additionalArguments){
      //不存在addtionalArguments则初始化一个空
      webPreferences.additionalArguments=[]
    }
    webPreferences.additionalArguments = Object.assign([
      '--user-data-path=' + userDataPath,
      '--app-version=' + app.getVersion(),
      '--app-name=' + app.getName(),
      ...((isDevelopmentMode ? ['--development-mode'] : [])),
      '--name=' + name
    ],webPreferences.additionalArguments)
    let view = new BrowserView({
      webPreferences
    })
    // if (rememberBounds) {
    //   let boundsSetting =WindowManager.getSettings(name,'bounds')
    //   if(alwaysOnTop){
    //     window.setAlwaysOnTop(alwaysOnTop)
    //   }
    //   if (boundsSetting) {
    //     window.setBounds(boundsSetting)
    //   }else if(defaultBounds){
    //     window.setBounds(defaultBounds)
    //   }
    // }
    // if (rememberBounds) {
    //   window.on('resized', () => {
    //     WindowManager.setSettings(name,'bounds',window.getBounds())
    //   })
    //   window.on('moved',()=>{
    //     WindowManager.setSettings(name,'bounds',window.getBounds())
    //   })
    //   window.on('always-on-top-changed',(e,isAlwaysOnTop)=>{
    //     WindowManager.setSettings(name,'alwaysOnTop',isAlwaysOnTop)
    //   })
    // }
    if (url) {
      view.webContents.loadURL(url)
    }
    this.viewMap[name] = view
    view.webContents.on('destroyed', () => {
      this.ensureInstanceRemoved('view', name)
    })
    let viewInstance = new ViewInstance({
      view: view,
      name: name
    }, this)
    this.instanceMap[name] = viewInstance
    this.webContentsMap[name] = view.webContents
    return viewInstance
  }

  /**
   * 将一个实例附加到主浏览器中
   * @param instance
   * @param pos 'right'
   * @param width
   */
  attachInstance(instance, pos, width = 480) {
    switch (pos) {
      case this.POS.RIGHT:
        this.attachedInstance = instance
        this.attachStatus = {
          pos: pos,
          name: instance.name,
          bounds: {}
        }
        this.stashCreateOptions = instance.createOptions
        let url = instance.window.getURL()
        let options = instance.initOption
        options.url = url
        this.close(instance.name)
        let viewInstance = this.createView(options)
        mainWindow.addBrowserView(viewInstance.view)
        let parentBounds = mainWindow.getBounds()
        let viewBounds = {
          x: parentBounds.width - width,
          y: 0,
          height: parentBounds.height,
          width
        }
        viewInstance.view.setBounds(viewBounds)
        viewInstance.view.setAutoResize({
          width: false,
          height: false,
          horizontal: false,
          vertical: false
        })
        this.attachedInstance = viewInstance
        this.attachedView = viewInstance.view
        this.viewManager.autoAdjustPosition('right', viewBounds.width)

      //todo viewManager重新调整位置
      //todo 根据options重新创建view到主浏览器中
    }
  }

  setTabAttach(option, width = 480) {
    let {tab, pos} = option
    pos = pos || 'right'
    let name = 'tab_' + tab.id
    let viewInstance = new ViewInstance({
      view: viewMap[tab.id],
      name: tab.id
    }, mainWindow)
    switch (pos) {
      case this.POS.RIGHT:
        this.attachedInstance = viewInstance
        this.attachStatus = {
          pos: pos,
          name: name,
          bounds: {}
        }
        //this.stashCreateOptions=instance.createOptions
        let parentBounds = mainWindow.getBounds()
        let viewBounds = {
          x: parentBounds.width - width,
          y: 0,
          height: parentBounds.height,
          width
        }
        viewInstance.view.setBounds(viewBounds)
        viewInstance.view.setAutoResize({
          width: false,
          height: false,
          horizontal: false,
          vertical: false
        })
        this.attachedInstance = viewInstance
        this.attachedView = viewInstance.view
        this.viewManager.autoAdjustPosition('right', viewBounds.width)
    }
  }

  detachInstance() {
    let instance = this.attachedInstance
    this.attachStatus = null
    let url = instance.view.webContents.getURL()
    this.close(instance.name)
    let options = this.stashCreateOptions
    options.url = url
    this.create(Object.assign(options, {url}))
  }

  detachTab() {
    this.attachStatus = null
    this.attachedInstance = null
    this.attachedView = null
    this.restoreAttachMod()
  }

  restoreAttachMod() {
    this.viewManager.restore()
  }

  onSetBounds(bounds) {
    return this.viewManager.onSetBounds(bounds)
  }

  syncAttachedBounds() {
    if (this.viewManager)
      this.viewManager.syncSize()
  }

  resetAttachPosition() {
    this.viewManager.resetAttachPosition()
  }

  static async getBoundsSetting (name) {
    return await this.getSettings(name, 'bounds')
  }

  static async setBoundsSetting (name, bounds) {
    await this.setSettings(name,'bounds', bounds)
  }

  static async setSettings (name, key, value) {
    await settingModel.set('appSetting',name , key, value)

    //settings.set('windowManager.settings.' + name + '.' + key, value)
  }

  static async getSettings (name, key) {
    return await settingModel.get('appSetting',name, key )
  }

  static async clearSettings (name, key) {
    await settingModel.clear('appSetting', name, key)
  }

  getWindowFromWebContentsId(id) {
    return BrowserWindow.fromWebContents(webContents.fromId(id))
  }

  /**
   * 查找实例
   * @param id
   * @returns {{instance, name, type: string}}
   */
  getInstanceFromWebContentsId(id) {
    let findInWind = Object.keys(this.windowMap).find(win => {
      return this.windowMap[win].webContents.id === id
    })
    if (findInWind) {
      return {
        type: 'window',
        name: findInWind,
        instance: this.windowMap[findInWind]
      }
    }
  }



  init() {
    app.whenReady().then(() => {
      BrowserViewHandler.listenIPC()
      ApiHandler.bindIPC()//绑定APIHandler的公共方法
    })
  }
}

module.exports = {
  WindowManager
}
