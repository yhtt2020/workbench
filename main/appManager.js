
let forceClose=false
/**
 * 运行中的应用窗体，结构{window:窗体对象,saApp:独立窗体app对象}
 * @type {*[]}
 */
let processingAppWindows=[]//运行中的应用
function apLog(e){
  if(0){
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
    async getAppRunningInfo(id){
      let saApp=appManager.getSaAppByAppId(id)
      if(!!!saApp){
        return //如果不存在这个saApp
      }
      let capture=await appManager.capture(saApp.windowId)
      let memoryUsage=appManager.memoryUsageInfo(saApp.windowId)
      let info={
        "capture":capture,
        "memoryUsage":memoryUsage
      }
      return info
    },
    /**
     * 获取应用内存信息
     * @param saAppWindowId
     */
    memoryUsageInfo(saAppWindowId){
      let saApp= appManager.getSaAppByWindowId(saAppWindowId)
      let appWindow=saApp.window //窗体
      let memoryInfo={}
      let allMetrics=app.getAppMetrics() //全局内存统计
      /*
      *[
[1]   {
[1]     cpu: { percentCPUUsage: 0, idleWakeupsPerSecond: 0 },
[1]     pid: 82207,
[1]     type: 'Browser',
[1]     creationTime: 1642407867658.929,
[1]     memory: { workingSetSize: 173120, peakWorkingSetSize: 173120 },
[1]     sandboxed: false
[1]   },
* https://www.electronjs.org/zh/docs/latest/api/structures/process-metric
* */
      let pid=appWindow.webContents.getOSProcessId()
      allMetrics.forEach((met)=>{
        if(met.pid===pid){
          memoryInfo=met
        }
      })
      return memoryInfo
    },
    /**
     * 通过windowId给APP截图
     * @param saAppWindowId
     */
    async capture(saAppWindowId){
      let saApp= appManager.getSaAppByWindowId(saAppWindowId)
      if(saApp.window.isDestroyed()){
        return
      }
      let capturedImage =  await saApp.window.webContents.capturePage()
      if(!fs.existsSync(userDataPath+'/app')){
        fs.mkdirSync(userDataPath+'/app')
      }
      let imagePath=path.resolve(userDataPath+'/app/screen'+saApp.saApp.id+'.jpg')
      try{
        fs.writeFileSync(imagePath,capturedImage.toJPEG(50))
      }catch (err){
        return false
      }
      return imagePath
    },
    closeApp(appId){
      let window=appManager.getWindowByAppId(appId)
      let saApp=appManager.getSaAppByAppId(appId)
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
          alwaysOnTop:saApp.settings.alwaysTop,
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
              ...((isDevelopmentMode ? ['--development-mode'] : [])),
            ]
          }
        })
        saApp.windowId=appWindow.webContents.id
        appWindow.setBounds(saApp.settings.bounds)
        appWindow.setMenu(null)
        if(saApp.type==='local'){
          appWindow.webContents.loadURL('file://'+path.join(__dirname,saApp.url))
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
        appWindow.on('ready-to-show',(event)=>{
          //连续4秒都获取一次截图，保障能够截取到最新的图
          appManager.capture(saApp.windowId)
          setTimeout(()=>{
            if(!appWindow.isDestroyed())
              appManager.capture(saApp.windowId)
          },2000)
          setTimeout(()=>{
            if(!appWindow.isDestroyed())
              appManager.capture(saApp.windowId)
          },3000)
          setTimeout(()=>{
            if(!appWindow.isDestroyed())
              appManager.capture(saApp.windowId)
          },4000)
        })
        appWindow.on('blur',async (event)=>{
          SidePanel.send('updateRunningInfo',{id:saApp.id,"info":await appManager.getAppRunningInfo(saApp.id)})
        })
        /**
         * 只允许通过关闭按钮隐藏，而不是彻底关闭
         */
        appWindow.on('close',(event,args)=>{
          if(!forceClose){
            appManager.hideWindow(saApp.windowId)
            event.preventDefault()
          }else{
            appManager.closeApp(saApp.id)
          }

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
        appManager.focusWindow(saApp.windowId)
      }
    }
  })
  ipc.on('closeApp',(event,args)=>{
    appManager.closeApp(args.id)
  })
  ipc.on('getAppRunningInfo',async (event,args)=>{
    SidePanel.send('updateRunningInfo',{id:args.id,"info":await appManager.getAppRunningInfo(args.id)})
  })
  /**
   * 获取并更新一个app的截图
   */
  ipc.on('getAppCapture',(event,args)=>{
    let saApp=appManager.getSaAppByAppId(args.id)
    if(!!!saApp){
      return //如果不存在这个saApp
    }
    let image= appManager.capture(saApp.windowId)
    if(!!image)
      SidePanel.send('updateAppCapture', { id:saApp.saApp.id,captureSrc:image})
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
    forceClose=true
    processingAppWindows.forEach((item)=>{
      if(!item.window.isDestroyed())
      {
        item.window.destroy()
      }
    })
  })
  console.log(process.platform)
  download()
})


let downloadWindow
function download(){
  downloadWindow = new BrowserWindow({
    width: 390,
    height: 465,
    resizable:false,
    acceptFirstMouse: true,
    maximizable:false,
    alwaysOnTop:true,
    webPreferences: {
      //preload: path.join(__dirname,saApp.preload),
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      sandbox: false,
      safeDialogs:false,
      safeDialogsMessage:false,
      partition:null,

    }
  })

  downloadWindow.loadFile('pages/download/index.html').whenReady().then(() =>{
    download()

  })
}

let {ipcMain} = require('electron')

ipcMain.on('show-context-menu', (event) => {
  const template = [
    {
      label: '启动',
      click: () => { event.sender.send('context-menu-command', 'menu-item-1') }
    },

    { label: '打开文件夹', },

    { label: '打开下载页', },
    { label: '分享', },
    { label: '复制下载链接', },
    { label: '删除', }
  ]
  const menu = Menu.buildFromTemplate(template)
  menu.popup(BrowserWindow.fromWebContents(event.sender))

})

var downloadItems = new Map();

function getDownloadItem(key) {
  if(downloadItems.has(key)){
    return downloadItems.get(key);
  }else{
    return false;
  }
}

ipcMain.on('stopDownload', (event, args) => {
  const item = getDownloadItem(args);
  console.log(item)
  if(item.isPaused()===false){
    item.pause();
  }
})
ipcMain.on('startDownload', (event, args) => {
  const item = getDownloadItem(args);
  if(item && item.isPaused()) {
    item.resume();
  }
})
ipcMain.on('cancleDownload', (event, args) => {
  if (args.state !== 'completed') {
    const item = getDownloadItem(args.time);
    if (item) {
      item.cancel();
      downloadItems.delete(args.time)
    }
  }
})

