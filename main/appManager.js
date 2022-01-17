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
    /**
     * 聚焦窗体
     * @param windowId
     */
    focusWindow(windowId){
      processingAppWindows.forEach((item)=>{
        if(item.saApp.windowId===windowId){
          if(!item.window.isVisible()){
            item.window.show()
          }
          item.window.focus()
        }
      })
    },
    /**
     * 隐藏窗体
     * @param windowId
     */
    hideWindow(windowId){
      processingAppWindows.forEach((item)=>{
        if(item.saApp.windowId===windowId){
          item.window.hide()
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
     * @param saAppId 应用id
     * @param settings 应用设置，一个对象，类似{isAlwaysHide:true,runAtStart:true} 参考开发文档
     */
    setAppSettings(saAppId,settings=[]){
      for(let i=0;i<processingAppWindows.length;i++){
        if(processingAppWindows[i].saApp.id===saAppId){
          processingAppWindows[i].saApp.settings=Object.assign(processingAppWindows[i].saApp.settings,settings)
          console.log(processingAppWindows[i].saApp.settings)
        }
      }
    },
    /**
     * 获取应用设置
     * @param saAppId 应用id
     * @param settingName 设置名称
     * @returns {*}
     */
    getAppSettings(saAppId,settingName){
      for(let i=0;i<processingAppWindows.length;i++){
        if(processingAppWindows[i].saApp.id===saAppId){
          return processingAppWindows[i].saApp.settings[settingName]
        }

      }
    },
    /**
     * 通过窗体获得saApp实体
     * @returns {*}
     */
    getSaAppByWindowId(saAppWindowId){
      for(let i=0;i<processingAppWindows.length;i++){
        if(processingAppWindows[i].saApp.windowId===saAppWindowId){
          return processingAppWindows[i]
        }
      }
    },
    /**
     * 通过WindowId获得对应索引
     * @returns {number}
     */
    getIndexByWindowId(saAppWindowId){
      for(let i=0;i<processingAppWindows.length;i++){
        if(processingAppWindows[i].saApp.windowId===saAppWindowId){
          return i
        }
      }
    },
    /**
     * 获取saApp信息，通过appid
     * @param appId
     * @returns {*}
     */
    getSaAppByAppId(appId){
      for(let i=0;i<processingAppWindows.length;i++){
        if(processingAppWindows[i].saApp.id===appId){
          return processingAppWindows[i].saApp
        }
      }
    },
    /**
     * 通过windowId给APP截图并传送ipc回sidePanel
     * @param saAppWindowId
     */
    capture(saAppWindowId){
      let saApp= appManager.getSaAppByWindowId(saAppWindowId)
      let capturedImage=undefined
      saApp.window.webContents.capturePage().then((data)=>{
        capturedImage=data
        if(!fs.existsSync(userDataPath+'/app')){
          fs.mkdirSync(userDataPath+'/app')
        }
        let imgePath=userDataPath+'/app/screen'+saApp.saApp.id+'.jpg'
        fs.writeFile(path.resolve(imgePath),capturedImage.toJPEG(50),(err)=>{
          if(!err){
            SidePanel.send('updateAppCapture', { id:saApp.saApp.id,captureSrc: path.resolve(imgePath)})
          }
        })
      })
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

        appWindow.on('show',(event)=>{
          console.log(saApp.windowId)
          setTimeout(()=>{
            appManager.capture(saApp.windowId)
          },1000)

        })
        /**
         * 关闭窗体的同时通知sidePanel关闭窗体
         */
        appWindow.on('close',(event,args)=>{
          if(appManager.getAppSettings(saApp.id,'alwaysHide')) {
            event.preventDefault()
            apLog('隐藏窗体'+saApp.id)
            appManager.hideWindow(saApp.windowId)
          } else {
            const result = dialog.showMessageBoxSync({
              type: 'none',
              buttons: ['取消','退出', '隐藏[不再询问]'],
              message: '退出后无法接受消息提醒,请注意!',
              cancelId: 0,
              defaultId: 2,
              noLink: true
            })
            if(result === 0 ) {
              apLog('阻止隐藏')
              event.preventDefault()
              return
            } else if(result === 2) {
              event.preventDefault()
              apLog('设置设置,true')
              appManager.setAppSettings(saApp.id,{'alwaysHide':true})//alwaysHide = true
              appManager.hideWindow(saApp.windowId)
              //groupIMWindow.hide()
            } else {
              appManager.removeAppWindow(saApp.windowId)
              SidePanel.send('closeApp',{app:saApp})
              //alwaysHide = false
              apLog('设置设置false')
              appManager.setAppSettings(saApp.id,{'alwaysHide':false})
            }
          }
        })

        processingAppWindows.push({
          window:appWindow,//在本地的对象中插入window对象，方便后续操作
          saApp:saApp
        })
        //完成运行后，截个图发送到侧边栏，更新其截图
        console.log(saApp)


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
  ipc.on('getAppCapture',(event,args)=>{
    let app=appManager.getSaAppByAppId(args.id)
    appManager.capture(app.windowId)
  })

  /**
   * 应用关闭前，将所有开启的窗体销毁掉
   */
  app.on('before-quit',()=>{
    processingAppWindows.forEach((item)=>{
      if(!item.window.isDestroyed())
      {
        item.window.destroy()
      }
    })
  })
})
