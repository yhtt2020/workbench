
class Win{
  win
  url
  width
  height
  resizable
  extraData
  alwaysTop
  constructor () {
    let config={}
    config.maximizable=true
    config.resizable=true
    config.show=false
    this.win=new BrowserWindow(config)
    this.initEvent()
    this.win.loadURL('/blank')
    this.url='/blank'
    //protocol.load(this.win,'/blank')
  }
  async use(param){
    this.url=param.url
    this.width=param.width
    this.height=param.height
    this.resizable=param.resizable
    this.extraData=param.extraData
    this.alwaysTop=param.alwaysTop
    await this.win.loadURL(this.url)
    this.win.setSize(this.width,this.height)
    this.win.setAlwaysOnTop(!!this.alwaysTop)
    this.win.center()
    this.win.show()
  }
  initEvent(){
    this.win.on('close',()=>{
      let index=pool.dic.findIndex(v=>v.url === this.url)
      pool.dic.splice(index,1)
    })
    this.win.on('maximize',()=>{
      this.win.webContents.send('windowMaximized')
    })
    this.win.on('unmaximize',()=>{
      this.win.webContents.send('windowUnmaximize')
    })
  }
}
class Pop{
  win
  constructor () {
    let config={}
    config.frame=false
    config.show=false
    config.webPreferences={
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
    this.win=new BrowserWindow(config)
    this.initEvent()
    this.win.loadURL('/blank')
    this.url='/blank'
  }
  initEvent(){
    this.win.on('close',()=>{
      let index=pool.pop.findIndex(v=>v.url === this.url)
      pool.pop.splice(index,1)
    })
    this.win.on('blur',()=>{
      this.win.close()
    })
    this.win.on('maximize',()=>{
      this.win.webContents.send('windowMaximized')
    })
    this.win.on('unmaximize',()=>{
      this.win.webContents.send('windowUnmaximize')
    })
  }
  async use(param){
    this.url=param.url
    this.width=param.width
    this.x=param.x
    this.y=param.y
    this.height=param.height
    this.resizable=param.resizable
    this.extraData=param.extraData
    this.alwaysTop=param.alwaysTop
    await this.win.loadURL(this.url)
    this.win.setSize(this.width,this.height)
    this.win.setPosition(this.x,this.y)
    this.win.setAlwaysOnTop(!!this.alwaysTop)
    this.win.show()
  }
}
class Pool {
  dic=[]
  pop=[]
  async init(){
    this.dic.push(new Win())
    this.pop.push(new Pop())
  }
  constructor () {
    ipc.handle('loadWindow',async(e,param)=>{
     await this.use(param)
    })
  }
  async use(param){
    let oldObj=this.dic.find(v=>v.url===param.url)
    if(oldObj){
      oldObj.win.show()
      oldObj.win.moveTop()
      return
    }
    let blankObj=this.dic.find(v=>v.url==='/blank')
    await blankObj.use(param)
    this.dic.splice(0,0,new Win())
  }
  async usePop(param){
    let oldObj=this.pop.find(v=>v.url===param.url)
    if(oldObj){
      oldObj.win.show()
      oldObj.win.moveTop()
      return oldObj
    }
    let blankObj=this.pop.find(v=>v.url==='/blank')
    await blankObj.use(param)
    this.pop.splice(0,0,new Pop())
    return  blankObj
  }
}
let pool=new Pool()
app.whenReady().then(()=>{
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

const render={
  renderWindows:[],//渲染窗体
  renderPopups:[],//渲染弹窗
  /**
   * 获得一个url，调试环境下，返回vite调试协议路径，正式环境下，返回tsbapp协议地址
   * @param url
   * @returns {string}
   */
  getUrl(url){
    if(isDevelopmentMode){
      return `http://localhost:1600/${url}`
    }else{
      return `tsbapp://.index.html/#${url}` //todo 需要验证正式环境的协议情况
    }
  },
  init(){
    app.on('ready',()=>{
      let regStats= protocol.registerBufferProtocol("tsbapp",(request,response)=>{
        this.regDefaultProtocol(request,response)
      })
      if(regStats){

      }else{
        console.log('注册协议失败')
      }
      ipc.on('addRenderTab',(event,args)=>{
        this.openRenderTab(args.url)
      })
    })

  },
  regDefaultProtocol(request,response){
    let pathName=new URL(request.url).pathname
    let extension=path.extname(pathName).toLowerCase()
    if(!extension) return
    pathName=decodeURI(pathName)
    let filePath=path.join(__dirname,pathName)
    fs.readFile(filePath,(error,data)=>{
      if(error) return
      let mimeType=''
      if(extension==='.js')
      {
        mimeType='text/javascript'
      }else if(extension==='.html'){
        mimeType='text/html'
      }else if(extension==='.css'){
        mimeType='text/css'
      }else if(extension==='.svg'){
        mimeType='image/svg+xml'
      }else if(extension==='.json'){
        mimeType='application/json'
      }
      response({mimeType,data})
    })
  },
  /**
   * 打开一个渲染tab
   * @param url
   */
  openRenderTab(url){
    let realUrl=this.getUrl(url)
    sendIPCToWindow(mainWindow,'addTab',{url:realUrl})
    console.log('发送ipc打开新标签页',realUrl)
  },
  openRenderWindow(url,windowArgs,webPreferences){
    console.log('创建一个渲染窗口')
    const defaultWebPreferences={
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
    let webP=Object.assign(defaultWebPreferences,webPreferences)
    const defaultWindowArgs={
      width:800,
      height: 800,
      backgroundColor: '#fff',//backgroundColor: '#fff', // the value of this is ignored, but setting it seems to work around https://github.com/electron/electron/issues/10559
      webPreferences:webP,
      show:false
    }
    let windowA=Object.assign(defaultWindowArgs,windowArgs)
    console.log(windowA)
    let win =new BrowserWindow(windowA)
    win.on('ready-to-show',()=> {
      win.show()
    })
    win.loadURL(this.getUrl(url))
    this.renderWindows.push(win)
    return win
  }
}

const renderPage={
  iconSelector:null,
  init(){

  },
  openIconSelector(pos){
    if(!this.iconSelector){
      pool.usePop({
        url:render.getUrl('icon.html'),
        width:390,
        height:320,
        x:pos.x,
        y:pos.y,
      }).then(win=>console.log(win))
    }
  }
}

render.init()
