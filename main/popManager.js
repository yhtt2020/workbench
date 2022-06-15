/*使用方法参考语雀文档：
* https://duanshuo.yuque.com/hfru7g/gta7yy/pzyk4z*/
let popList = [] //弹窗池
/**
 * 必须先手动填入这个常量中，才可通过popManager调用，主要是为了防止不受控
 * @type {string[]}
 */
const popRegistered = [
  'favSaveToFolder',//收藏夹保存到文件夹窗体
]
const popManager = {
  /**
   * 准备窗体
   */
  preparePop (name = Date.now().toString(), url, options = {}, webPreferences = {},fileOption) {
    if (popRegistered.indexOf(name) === -1) {
      return false //如果不在注册的弹窗清单中，则直接返回假
    }
    let popWindow = popManager.get(name)
    if (popWindow) {
      return popWindow
    }
    options = Object.assign({
      width: 800,
      height: 600,
      acceptFirstMouse: true,
      alwaysOnTop: true,
      show: false,
      //resizable: false,  //必须设置为resizeable，无法resize的窗体在window上无边框和阴影
      frame: false,
      webPreferences: webPreferences
    }, options)
    webPreferences = Object.assign({
      //preload: __dirname+'/pages/saApp/settingPreload.js',
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      sandbox: false,
      safeDialogs: false,
      safeDialogsMessage: false,
      partition: null,
      webSecurity:false,
      additionalArguments: [
        '--user-data-path=' + userDataPath,
        '--app-version=' + app.getVersion(),
        '--app-name=' + app.getName()
      ]
    }, webPreferences)
    options.webPreferences = webPreferences
    let pop = new BrowserWindow(options)
    if(url.startsWith('http') || url.startsWith('https')){
      pop.loadURL(url)
    }else{
      pop.loadFile(url,fileOption)
    }
    pop.on('blur', () => {
      pop.hide()
    })
    pop.on('will-resize',(event)=>{
      event.preventDefault()
    })
    popWindow = {
      name: name,
      window: pop,
      /**
       * 设置窗体Bounds，如果窗体不存在，则返回false
       * @param bounds {width,height,x,y}
       */
      setBounds (bounds) {
        popWindow.window.setBounds(bounds)
      }
    }

    popList.push(popWindow)
    return popWindow
  },
  /**
   * 根据窗体名称创建窗体
   * @param name
   * @returns {boolean|*}
   */
  get (name) {
    let find = popList.find(item => {
      if (item.name === name)
        return item
    })
    if (find) {
      return find
    } else {
      return false
    }
  },
  /**
   * 使用管理器进行bounds设置，设置窗体的bounds。如果本身就已经获取到了popWindow对象，建议直接使用此对象的setBounds
   * @param name  名称
   * @param bounds  bounds
   * @returns {boolean}
   */
  setBounds (name, bounds) {
    let popWindow = popManager.get(name)
    if (popWindow) {
      popWindow.setBounds(bounds)
      return popWindow
    } else {
      return false
    }
  },
  /**
   * 根据条件自动创建一个窗体，基于name去重，如果已经存在预热过的窗体，则直接返回。
   * @param name 名称
   * @param url url
   * @param options 窗体options
   * @param webPreferences
   * @returns {BrowserWindow}
   */
  openPop (name = Date.now().toString(), url, options = {}, webPreferences = {},fileOptions) {
    let popWindow = popManager.preparePop(name, url, options, webPreferences,fileOptions)
    if (popWindow) {
      popWindow.window.show()
      return popWindow
    } else {
      throw new Error('未注册的pop，不可直接使用，请到popManager中手动注册后使用。')
    }
  }
}


