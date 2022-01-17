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
     * 单个更新app信息
     * @param id
     * @param saApp
     */
    updateSaApp(id,saApp){
      for(let i=0;i<processingAppWindows.length;i++){
        if(processingAppWindows[i].saApp.id===id){
          processingAppWindows[i].saApp=saApp
          return true
        }
      }
      return false
    },
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
     let saApp= appManager.getSaAppByAppId(saAppId)
      if(saApp){
        SidePanel.send('updateSetting',{id:saAppId,settings:settings})
        saApp.settings=Object.assign(saApp.settings,settings)
        appManager.updateSaApp(saAppId,saApp)
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
    getWindowByAppId(appId){
      for(let i=0;i<processingAppWindows.length;i++){
        if(processingAppWindows[i].saApp.id===appId){
          return processingAppWindows[i].window
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
      if(saApp.window.isDestroyed()){
        return
      }
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
    closeApp(appId){
      let window=appManager.getWindowByAppId(appId)
      let saApp=appManager.getSaAppByAppId(appId)
      console.log(saApp)
      if(!window.isDestroyed()){
        window.destroy()
        appManager.removeAppWindow(saApp.windowId)
        SidePanel.send('closeApp',{id:appId})
      }
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
        appWindow.on('moved',(event,args)=>{
          appManager.setAppSettings(saApp.id,{bounds:appWindow.getBounds()})
        })
        appWindow.on('resized',(event,args)=>{
          appManager.setAppSettings(saApp.id,{bounds:appWindow.getBounds()})
        })

        //   //   groupIMWindow.on('resized',()=>{
        //   //     settings.set('groupWindowBounds',groupIMWindow.getBounds())
        //   //   })
        //   //   groupIMWindow.on('moved',()=>{
        //   //     settings.set('groupWindowBounds',groupIMWindow.getBounds())
        //   //   })

        appWindow.on('ready-to-show',(event)=>{
          //连续4秒都获取一次截图，保障能够截取到最新的图
          appManager.capture(saApp.windowId)
        })
        appWindow.on('blur',(event)=>{
            appManager.capture(saApp.windowId)
        })
        /**
         * 只允许通过关闭按钮隐藏，而不是彻底关闭
         */
        appWindow.on('close',(event,args)=>{
          appManager.hideWindow(saApp.windowId)
          event.preventDefault()
            // const result = dialog.showMessageBoxSync({
            //   type: 'none',
            //   buttons: ['取消','退出', '隐藏[不再询问]'],
            //   message: '退出后无法接受消息提醒,请注意!',
            //   cancelId: 0,
            //   defaultId: 2,
            //   noLink: true
            // })
            // if(result === 0 ) {
            //   apLog('阻止隐藏')
            //   event.preventDefault()
            //   return
            // } else if(result === 2) {
            //   event.preventDefault()
            //   apLog('设置设置,true')
            //   appManager.setAppSettings(saApp.id,{'alwaysHide':true})//alwaysHide = true
            //
            //   //groupIMWindow.hide()
            // } else {
            //   appManager.closeApp(saApp.id)
            //   //alwaysHide = false
            //   apLog('设置设置false')
            //   appManager.setAppSettings(saApp.id,{'alwaysHide':false})
            // }

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
      if(!appManager.isAppProcessing(saApp.id)){
        appManager.executeApp(saApp)
      }
    }else{
      //todo 判断是多例还是单例
      if(1){//是单例
        console.log(saApp)
        appManager.focusWindow(saApp.windowId)
      }
    }
  })
  ipc.on('closeApp',(event,args)=>{
    appManager.closeApp(args.id)
  })
  /**
   * 获取并更新一个app的截图
   */
  ipc.on('getAppCapture',(event,args)=>{
    let saApp=appManager.getSaAppByAppId(args.id)
    if(!!!saApp){
      return //如果不存在这个saApp
    }
    appManager.capture(saApp.windowId)
  })
  /**
   * 获取到全部正在运行的app清单
   */
  ipc.on('getRunningApps',(event,args)=>{
    let runningApps=[]
    let windows=[]
    processingAppWindows.forEach(window=>{

      runningApps.push(window.saApp.id)
      windows.push(window.saApp.windowId)
    })
    SidePanel.send('updateRunningApps',{runningApps:runningApps,windows:windows})
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
