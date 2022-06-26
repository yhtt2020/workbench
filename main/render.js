const render={
  renderWindows:[],
  /**
   * 获得一个url，调试环境下，返回vite调试协议路径，正式环境下，返回tsbapp协议地址
   * @param url
   * @returns {string}
   */
  getUrl(url){
    if(isDevelopmentMode){
      return `http://localhost:1600/#${url}`
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
        console.log('准备打开一个渲染界面')
        setTimeout(()=>{
          let win=this.openRenderWindow('/',{
            width:300,
            height:400
          })

        },2000)

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

render.init()
