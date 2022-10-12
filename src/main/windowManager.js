/**
 * 实例类，主要是将窗体之类的对象进行再一次封装，方便对其进行二次操作
 */

class Instance {
  type = 'window'
  name
  object = null
  initOption
  createOptions //首次初始化时的options

  constructor (initOption) {
    this.initOption = initOption
    this.createOptions=initOption.createOptions
    this.name = initOption.name
  }

  destroy () {

  }

  close () {
    windowManager.close(this.name)
  }
}

/**
 * 代理view管理
 */
class ViewManager {
  SPLIT_WIDTH = 10
  bindedMainWindowEvent = false //是否已经绑定了主窗体事件
  lastWidth = 0 //最后一次调整的分体窗体的宽度

  autoAdjustPosition (pos, width) {
    if(!windowManager.attachedView){
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
      if(viewMap[key]===windowManager.attachedView && Object.keys(viewMap).length>1)
      {
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
      sendIPCToMainWindow('showSplitBar', { bounds })
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

    windowManager.attachStatus.bounds=attachedViewBounds
  }

  restore () {
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
  resetAttachPosition () {
    let cursorPosition = require('electron').screen.getCursorScreenPoint()
    let parentBounds = mainWindow.getBounds()
    this.autoAdjustPosition('right', parentBounds.width + parentBounds.x - cursorPosition.x)
  }

  syncSize () {
    if (windowManager.attachedView) {
      this.autoAdjustPosition('right', this.lastWidth)
    }
  }

  /**
   * 当主进程中webviews被设置bounds的时候回调，如果存在attchedView则修正尺寸
   * @param bounds
   * @returns {*}
   */
  onSetBounds (bounds) {
    if (windowManager.attachedView) {
      if(mainWindow.getBrowserViews().indexOf(windowManager.attachedView)===-1){
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
 * 窗体类
 */
class WindowInstance extends Instance {
  window

  constructor (initOption) {
    super(initOption)
    this.window = initOption.window
  }

  create () {
    //todo 将窗体实例创建的方法搬过来
  }

  close () {
    this.window.close()
    this.destroy()
  }
}

/**
 * view类
 */
class ViewInstance extends Instance {
  type = 'view'
  view
  parent

  constructor (initOption,parent) {
    super(initOption)
    this.view = initOption.view
    this.parent=parent
  }

  create () {
    //todo 将窗体实例创建的方法搬过来
  }

  close () {
    if(mainWindow){
      mainWindow.removeBrowserView(this.view)
    }
    if(this.view.webContents && !this.view.webContents.isDestroyed())
    {
      this.view.webContents.destroy()
    }
    this.parent.restoreAttachMod()
    windowManager.attachedView=null
    windowManager.attachedInstance=null
    windowManager.attachStatus=null
    this.destroy()
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
  attachStatus=null //{ name ,bounds, pos} //吸附窗体的状态
  stashCreateOptions=null//暂存的window的初始化设置

  viewManager = null

  constructor () {

    this.viewManager = new ViewManager()
  }

  defaultViewPreferences = { //根据其定义的位置取用这里的width和height，在左右侧的话，只取用width，在上下，则只取height，目前仅支持width
    width: 480,
  }
  defaultWindowPreferences = {}
  defaultWebPreferences = {
    nodeIntegration: false,
    nodeIntegrationInSubFrames: true,
    scrollBounce: true,
    safeDialogs: true,
    safeDialogsMessage: '阻止此页面弹窗',
    preload: path.join(__dirname, 'src/browserApi/apiPreload.js'),
    contextIsolation: true,
    sandbox: true,
    shadow:true,
    acceptFirstMouse:true,
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
  isAlive (name) {
    return this.instanceMap[name] !== undefined
  }

  get (name) {
    return this.instanceMap[name]
  }

  close (name,destroy=true) {
    let instance = this.instanceMap[name]
    if (instance) {
      if(destroy) {
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
  ensureInstanceRemoved(type,name){
    if(this[type+'Map'][name]){
      delete this[type+'Map'][name]
    }
    if(this.instanceMap[name] && this.instanceMap[name].type===type){
      //判断一下类型是否匹配，如果不匹配，可能是切换，而不是关闭，此时可能之后，则不需要移除
      delete this.instanceMap[name]
      if(this.webContentsMap[name]){
        delete this.webContentsMap[name]
      }
    }

  }

  /**
   * name可以是字符串，也可以是时间戳，字符串一般用于经常用到的窗体，而时间戳则是临时窗体
   * @param options {mod,existingWindowId, name, webPreferences, boundsString, events,rememberBounds,url,defaultBounds}
   */
  create (options) {
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
      webPreferences = Object.assign(this.defaultWebPreferences, webPreferences)
    this.optionMap[name] = name
    let wenContents
    let instance
    if (mod === this.MOD.NO_CONTROLLER) {
      windowOption.webPreferences = webPreferences
      windowOption = Object.assign(this.defaultWindowPreferences, windowOption)
      windowOption.webPreferences.additionalArguments = [
        '--user-data-path=' + userDataPath,
        '--app-version=' + app.getVersion(),
        '--app-name=' + app.getName(),
        ...((isDevelopmentMode ? ['--development-mode'] : [])),
        '--name=' + name
      ]
      let window = new BrowserWindow(windowOption)
      if (rememberBounds) {
        let boundsSetting = WindowManager.getSettings(name, 'bounds')
        let alwaysOnTop = WindowManager.getSettings(name, 'alwaysOnTop')
        if (alwaysOnTop) {
          window.setAlwaysOnTop(alwaysOnTop)
        }
        if (boundsSetting) {
          window.setBounds(boundsSetting)
        } else if (defaultBounds) {
          window.setBounds(defaultBounds)
        }
      }
      window.on('ready-to-show', () => {
        window.show()
      })

      window.on('closed',()=>{
        this.ensureInstanceRemoved('window',name)
      })
      webContents = window.webContents
      if (rememberBounds) {
        window.on('resized', () => {
          WindowManager.setSettings(name, 'bounds', window.getBounds())
        })
        window.on('moved', () => {
          WindowManager.setSettings(name, 'bounds', window.getBounds())
        })
        window.on('always-on-top-changed', (e, isAlwaysOnTop) => {
          WindowManager.setSettings(name, 'alwaysOnTop', isAlwaysOnTop)
        })
      }
      if (url) {
        window.loadURL(url)
      }
      this.windowMap[name] = window
      let windowInstance = new WindowInstance({
        window: window,
        createOptions:options,
        name: name
      })
      instance = windowInstance
    }
    this.instanceMap[name] = instance
    this.webContentsMap[name] = webContents
    return instance
  }

  createView (options) {
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
    webPreferences.additionalArguments = [
      '--user-data-path=' + userDataPath,
      '--app-version=' + app.getVersion(),
      '--app-name=' + app.getName(),
      ...((isDevelopmentMode ? ['--development-mode'] : [])),
      '--name=' + name
    ]
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
    view.webContents.on('destroyed',()=>{
      this.ensureInstanceRemoved('view',name)
    })
    let viewInstance = new ViewInstance({
      view: view,
      name: name
    },this)
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
  attachInstance (instance, pos, width = 480) {
    switch (pos) {
      case this.POS.RIGHT:
        this.attachedInstance = instance
        this.attachStatus={
          pos:pos,
          name:instance.name,
          bounds:{}
        }
        this.stashCreateOptions=instance.createOptions
        let url =instance.window.getURL()
        let options=instance.initOption
        options.url=url
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
          width:false,
          height:false,
          horizontal:false,
          vertical:false
        })
        this.attachedInstance = viewInstance
        this.attachedView = viewInstance.view
        this.viewManager.autoAdjustPosition('right',viewBounds.width)

      //todo viewManager重新调整位置
      //todo 根据options重新创建view到主浏览器中
    }
  }
  setTabAttach(option,width=480){
    let {tab,pos}=option
    pos= pos || 'right'
    let name='tab_'+tab.id
    let viewInstance= new ViewInstance({
      view:viewMap[tab.id],
      name:tab.id
    },mainWindow)
    switch (pos) {
      case this.POS.RIGHT:
        this.attachedInstance =viewInstance
        this.attachStatus={
          pos:pos,
          name:name,
          bounds:{}
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
          width:false,
          height:false,
          horizontal:false,
          vertical:false
        })
        this.attachedInstance = viewInstance
        this.attachedView = viewInstance.view
        this.viewManager.autoAdjustPosition('right',viewBounds.width)
    }
  }

  detachInstance(){
    let instance = this.attachedInstance
    this.attachStatus=null
    let url =instance.view.webContents.getURL()
    this.close(instance.name)
    let options= this.stashCreateOptions
    options.url=url
    this.create(Object.assign(options, { url }))
  }
  detachTab(){
    this.attachStatus=null
    this.attachedInstance=null
    this.attachedView=null
    this.restoreAttachMod()
  }
  restoreAttachMod(){
    this.viewManager.restore()
  }
  onSetBounds(bounds){
    return this.viewManager.onSetBounds(bounds)
  }
  syncAttachedBounds(){
    if(this.viewManager)
      this.viewManager.syncSize()
  }

  resetAttachPosition(){
    this.viewManager.resetAttachPosition()
  }
  static getBoundsSetting (name) {
    return settings.get('windowManager.bounds.' + name)
  }

  static setBoundsSetting (name, bounds) {
    settings.set('windowManager.bounds.' + name, bounds)
  }

  static setSettings (name, key, value) {
    settings.set('windowManager.settings.' + name + '.' + key, value)
  }

  static getSettings (name, key) {
    return settings.get('windowManager.settings.' + name + '.' + key)
  }

  getWindowFromWebContentsId (id) {
    return BrowserWindow.fromWebContents(webContents.fromId(id))
  }

  /**
   * 查找实例
   * @param id
   * @returns {{instance, name, type: string}}
   */
  getInstanceFromWebContentsId (id) {
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

  /**
   * 通用绑定事件方法，额外增加了一个instance参数以便于api区分当前的instance
   * @param channel
   * @param cb
   */
  onWindow (channel, cb) {
    this._on('api.window.' + channel, (event, args) => {
      let instance = this.get(args['_name'])

      cb(event, args, instance)
    })
  }

  _on (channel, cb) {
    ipc.on(channel, cb)
  }

  init () {
    app.whenReady().then(() => {
      ipc.on('api.runtime.init', (event, args) => {

      })

      this.onWindow('close', (event, args) => {
        //todo 修改为实例操作，而非直接关闭窗体，因为不同的模式下，其操作模式也不一致
        this.close(args['_name'])
      })

      this.onWindow('setAlwaysOnTop', (event, args, instance) => {
        instance.window.setAlwaysOnTop(args.flag)
      })

      this.onWindow('isAlwaysOnTop', (event, args, instance) => {
        if(instance.type==='view'){
          event.returnValue=false //view的话，统一返回false
          return
        }
        event.returnValue = instance.window.isAlwaysOnTop()
      })

      this.onWindow('attach', (event, args, instance) => {
        if(this.attachedInstance===instance){
          return
        }
        this.attachInstance(instance, args.pos, args.width)
      })

      this.onWindow('detach',(event,args,instance)=>{
        if(this.attachedInstance!==instance){
          return
        }
        this.detachInstance()
      })

      this.onWindow('getAttachStatus',(event,args,instance)=>{
        if(this.attachedInstance!==instance){
          event.returnValue=false
        }else{
          event.returnValue=this.attachStatus
        }
      })
    })
  }
}




