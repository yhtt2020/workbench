/**
 * 实例类，主要是将窗体之类的对象进行再一次封装，方便对其进行二次操作
 */
class Instance {
  type='window'
  name
  object=null
  initOption
  constructor (initOption) {
    this.initOption=initOption
    this.name=initOption.name
  }
  destroy(){

  }
  close(){
    windowManager.close(this.name)
  }
}

/**
 * 窗体类
 */
class WindowInstance extends Instance{
  window
  constructor (initOption) {
    super(initOption)
    this.window=initOption.window
  }
  create(){
    //todo 将窗体实例创建的方法搬过来
  }
  close(){
    this.window.close()
    this.destroy()
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
    preload:  path.join(__dirname, 'src/browserApi/apiPreload.js'),
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
   * 是否存在窗体，存在则返回Instance，不存在则返回undefined
   * @param name
   * @returns {*}
   */
  isAlive(name){
    return this.instanceMap[name]!==undefined
  }

  get(name){
    return this.instanceMap[name]
  }

  close(name){
    let instance=this.instanceMap[name]
    if(instance){
     instance.close()
      delete this.instanceMap[name]
    }else{
      throw 'instance不存在'
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
      windowOption.webPreferences.additionalArguments=[
        '--user-data-path=' + userDataPath,
        '--app-version=' + app.getVersion(),
        '--app-name=' + app.getName(),
        ...((isDevelopmentMode ? ['--development-mode'] : [])),
        '--name='+name
      ]
      let window = new BrowserWindow(windowOption)
      if (rememberBounds) {
        let boundsSetting =WindowManager.getSettings(name,'bounds')
        let alwaysOnTop=WindowManager.getSettings(name,'alwaysOnTop')
        if(alwaysOnTop){
          window.setAlwaysOnTop(alwaysOnTop)
        }
        if (boundsSetting) {
          window.setBounds(boundsSetting)
        }else if(defaultBounds){
          window.setBounds(defaultBounds)
        }
      }
      window.on('ready-to-show', () => {
        window.show()
      })
      webContents = window.webContents
      if (rememberBounds) {
        window.on('resized', () => {
          WindowManager.setSettings(name,'bounds',window.getBounds())
        })
        window.on('moved',()=>{
          WindowManager.setSettings(name,'bounds',window.getBounds())
        })
        window.on('always-on-top-changed',(e,isAlwaysOnTop)=>{
          WindowManager.setSettings(name,'alwaysOnTop',isAlwaysOnTop)
        })
      }
      if (url) {
        window.loadURL(url)
      }
      this.windowMap[name]=window
       let windowInstance=new WindowInstance({
         window:window,
         name:name
       })
      instance=windowInstance
    }
    this.instanceMap[name]=instance
    this.webContentsMap[name] = webContents
    return instance
  }
  static getBoundsSetting(name){
    return  settings.get('windowManager.bounds.' + name)
  }
  static setBoundsSetting(name,bounds){
    settings.set('windowManager.bounds.' + name, bounds)
  }
  static setSettings(name,key,value){
    settings.set('windowManager.settings.' + name+'.'+key, value)
  }
  static getSettings(name,key){
    return settings.get('windowManager.settings.' + name+'.'+key)
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

      function _on (channel, cb) {
        ipc.on(channel, cb)
      }

      function onWindow (channel, cb) {
        _on('api.window.' + channel, cb)
      }

      function getWindow (event) {

      }

      onWindow('close', (event, args) => {
        //todo 修改为实例操作，而非直接关闭窗体，因为不同的模式下，其操作模式也不一致
        this.close(args['_name'])
      })

      onWindow('setAlwaysOnTop',(event,args)=>{
        let instance=this.get(args['_name'])
        instance.window.setAlwaysOnTop(args.flag)
      })

      onWindow('isAlwaysOnTop',(event,args)=>{
        let instance=this.get(args['_name'])
        event.returnValue=instance.window.isAlwaysOnTop()
      })
    })
  }
}




