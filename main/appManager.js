/**
 * 运行中的应用窗体，结构{window:窗体对象,saApp:独立窗体app对象}
 * @type {*[]}
 */
let processingAppWindows=[]//运行中的应用
function apLog(e){
  if(1){
    console.log(e)
  }
}
/**
 * 执行一个应用
 */
app.whenReady().then(()=>{
  const appManager={
    focusWindow(windowId){
      processingAppWindows.forEach((item)=>{
        if(item.saApp.windowId===windowId){
          item.window.focus()
        }
      })
    },
    /**
     * 获得app运行状态
     * @param saAppId appId
     * @returns {boolean}
     */
    isAppProcessing(saAppId){
      let processing=false
      processingAppWindows.forEach((item)=>{
        if(item.saApp.id===saAppId){
          processing= !item.window.isDestroyed()
        }
      })
      return processing
    },
    /**
     * 移除appWindow
     * @param saAppWindowId 窗体id,这里不适用appid，因为未来可能是多开窗体的
     */
    removeAppWindow(saAppWindowId){
      for(let i=0;i<processingAppWindows.length;i++){
          if(processingAppWindows[i].saApp.windowId===saAppWindowId){
            processingAppWindows.splice(i,1)
          }

      }
    },
    /**
     * 设置应用的设置
     * @param settings
     */
    setAppSettings(settings=[]){

    },
    /**
     * 执行应用
     * @param saApp 一个应用实体
     */
    executeApp(saApp){
      if(1){
        //todo 判断一下是不是独立窗体模式
        let appWindow=new BrowserWindow({
          width: 800,
          height: 600,
          acceptFirstMouse: true,
          webPreferences: {
            preload: path.join(__dirname,saApp.preload),
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
            sandbox: false,
            safeDialogs:false,
            safeDialogsMessage:false,
            partition:null,
            additionalArguments: [
              '--user-data-path=' + userDataPath,
              '--app-version=' + app.getVersion(),
              '--app-name=' + app.getName(),
              //...((isDevelopmentMode ? ['--development-mode'] : [])),
            ]
          }
        })
        apLog(path.join(__dirname,saApp.preload))
        saApp.windowId=appWindow.webContents.id

        appWindow.setBounds(saApp.settings.bounds)
        if(saApp.type==='local'){
          appWindow.webContents.loadURL('file://'+path.join(__dirname,saApp.url))
          apLog(path.join(__dirname,saApp.url))
        }else{
          appWindow.webContents.loadURL(saApp.url)
        }

        SidePanel.send('executedAppSuccess',{app:saApp})
        appWindow.on('resize',(event,args)=>{
          //todo 完成设置同步
        })

        /**
         * 关闭窗体的同时通知sidePanel关闭窗体
         */
        appWindow.on('close',(event,args)=>{
          appManager.removeAppWindow(saApp.windowId)
          SidePanel.send('closeApp',{app:saApp})
        })

        processingAppWindows.push({
          window:appWindow,//在本地的对象中插入window对象，方便后续操作
          saApp:saApp
        })
        console.log(processingAppWindows)
      }else{
        //todo intab模式，在主窗体某个标签内
      }
    }
  }

  ipc.on('executeApp', (event, args) => {
    let saApp = args.app
    if(!!!saApp.processing){
      //首先必须是没运行的
      console.log('想要执行app')
      if(!appManager.isAppProcessing(saApp.id)){
        appManager.executeApp(saApp)
      }
    }else{
      //todo 判断是多例还是单例
      if(1){//是单例
        apLog('聚焦单例'+saApp.windowId)
        appManager.focusWindow(saApp.windowId)
      }
    }
  })

})
