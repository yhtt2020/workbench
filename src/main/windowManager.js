/**
 * 实例类，主要是将窗体之类的对象进行再一次封装，方便对其进行二次操作
 */
class Instance {
  type='window'
  object=null
  initOption
  constructor (initOption) {
    this.initOption=initOption
  }
  destroy(){

  }
}

/**
 * 窗体类
 */
class WindowInstance extends Instance{
  constructor (initOption) {
    super(initOption)
  }
  create(){
    //todo 将窗体实例创建的方法搬过来
  }
}


/**
 * 窗口管理类，主要用于控制一些窗体，可以实现独立小窗体、吸附窗体。
 * 实现了事件绑定，可以在渲染进程自由绑定。
 */
class WindowManager {
  instanceMap={} //name:instance

  windowMap = {} //name:window
  viewMap = {} //name:view
  webContentsMap = {} //name:webcontents
  windowStateMap = {} //name:{attach:false , }
  optionMap = {} //id: windowConfig:{} 如果为view,则为null ，当window转为attach的时候，为设置为null,webPreferences:{}
  constructor () {}

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

  /**
   * 是否存在窗体，存在则返回窗体，不存在则返回undefined
   * @param name
   * @returns {*}
   */
  isAlive(name){
    console.log('找到窗体',this.windowMap[name])
    return this.windowMap[name]
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

    console.log(webPreferences)
    this.optionMap[name] = name
    let wenContents
    let instance
    if (mod === this.MOD.NO_CONTROLLER) {
      windowOption.webPreferences = webPreferences
      windowOption = Object.assign(this.defaultWindowPreferences, windowOption)
      instance = new BrowserWindow(windowOption)
      if (rememberBounds) {
        let boundsSetting = WindowManager.getBoundsSetting(name)
        if (boundsSetting) {
          instance.setBounds(boundsSetting)
        }else if(defaultBounds){
          instance.setBounds(defaultBounds)
        }
      }
      instance.on('ready-to-show', () => {
        instance.show()
      })
      webContents = instance.webContents
      if (rememberBounds) {
        instance.on('resized', () => {
          WindowManager.setBoundsSetting(name,instance.getBounds())
        })
      }
      if (url) {
        instance.loadURL(url)
      }
      this.windowMap[name]=instance
    }

    this.webContentsMap[name] = webContents
    return instance
  }
  static getBoundsSetting(name){
    return  settings.get('windowManager.bounds.' + name)
  }
  static setBoundsSetting(name,bounds){
    settings.set('windowManager.bounds.' + name, bounds)
  }
  getWindowFromWebContentsId(id){
    return BrowserWindow.fromWebContents(webContents.fromId(id))
  }

  /**
   * 查找实例
   * @param id
   * @returns {{instance, name, type: string}}
   */
  getInstanceFromWebContentsId(id){
   let findInWind= Object.keys(this.windowMap).find(win=>{
      return this.windowMap[win].webContents.id===id
    })
    if(findInWind){
      return {
        type:'window',
        name:findInWind,
        instance:this.windowMap[findInWind]
      }
    }
  }

  init () {
    app.whenReady().then(() => {
      ipc.on('api.runtime.init', (event, args) => {

      })

      function on (channel, cb) {
        console.log('api on ' + channel)
        ipc.on(channel, cb)
      }

      function onWindow (channel, cb) {
        on('api.window.' + channel, cb)
      }

      function getWindow (event) {

      }


      onWindow('close', (event, args) => {
        //todo 修改为实例操作，而非直接关闭窗体，因为不同的模式下，其操作模式也不一致
        this.getWindowFromWebContentsId(event.sender.id).close()
      })

    })
  }
}




