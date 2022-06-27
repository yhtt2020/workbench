const { autoUpdater } = require('electron-updater')
let updaterWindow=null
let  showedError=false
function loadUpdate(updateInfo){
  if(!updaterWindow){
    updaterWindow= new BrowserWindow({
      parent: mainWindow,
      width: 500,
      height: 580,
      resizable: false,
      visible:false,
      acceptFirstMouse: true,
      webPreferences: {
        //preload: path.join(__dirname, '/pages/update/inde.js'),
        nodeIntegration: true,
        contextIsolation: false,
        additionalArguments: [
          '--user-data-path=' + userDataPath,
          '--app-version=' + app.getVersion(),
          '--app-name=' + app.getName(),
          ...((isDevelopmentMode ? ['--development-mode'] : [])),
        ]
      }
    })
    updaterWindow.on('close',()=>updaterWindow=null)
    updaterWindow.setMenu(null)
    updaterWindow.webContents.loadURL('file://' + __dirname + "/pages/update/index.html")
    updaterWindow.on('ready-to-show',()=>{
      updaterWindow.show()
      updaterWindow.webContents.send('getInfo',{updateInfo:updateInfo,currentVersion: app.getVersion()})
      if(isDevelopmentMode){
        //updaterWindow.openDevTools()
      }

    })
    updaterWindow.focus()
  }else{
    updaterWindow.focus()
  }

}
let updateData={}
//app.whenReady().then(()=>loadUpdate())
// 自动检测升级机制
function checkUpdate(){
  if(isDevelopmentMode){
    //如果是开发环境，直接不检测，如需调试升级工具，将此处return注释掉即可
    return
  }
  autoUpdater.logger=electronLog
  function showError(error,tag='check'){
    if(!electron.net.online){
      if(SidePanel.alive()){
        sidePanel.get().webContents.send('message',{type:'info',config:{content:"当前为离线状态，自动更新程序暂不检测更新，请联网后重启应用检测。",key:"update",duration:6}})
      }
      return
    }
    let errInfo='未知'
    if(error.code===2){
      errInfo="软件包名无法验证"
    }
    if(SidePanel.alive() && showedError === false){
      sidePanel.get().webContents.send('message',{type:'error',config:{content:"自动更新程序意外终止,错误原因： "+errInfo+" ，将为您打开产品官网apps.vip，请至官网手动下载最新版本更新。",key:tag,duration:6}})
      showedError=true
      sendIPCToWindow(mainWindow, 'addTab', {
        url: 'https://apps.vip/#download'
      })
    }
  }
  autoUpdater.checkForUpdates().then((checkResult)=>{
    //检测到可以升级，则发送升级的信息到updateWindow
    updateData={
      version:checkResult.updateInfo.version,
      releaseDate:checkResult.updateInfo.releaseDate
    }
    console.log(updateData)

  }).catch((error)=> {
    showError(error,'checkError')
  })
  autoUpdater.on('error',(error)=>{
    showError(error,'error')
  })

  autoUpdater.on('update-available',(data)=>{
    updateInfo=data
    //console.log(updateInfo)
    setTimeout(()=>{
      if(SidePanel.alive()){
        sidePanel.get().webContents.send('message',{type:'success',config:{content:"有新版本可用，将为您准备更新。",key:"check"}})
      }
    },2000)
  })

  // autoUpdater.on('download-progress',(progressObj)=>{
  //   updaterWindow.webContents.send('downloadProgress',progressObj)
  // })

  autoUpdater.on('update-downloaded',(event,releaseEvents,releaseName,releaseDate,updateUrl,quitAndUpdate)=>{
    // ipc.on('updateNow',(e,arg)=>{
    //   autoUpdater.quitAndInstall()
    // })
    //console.log('update下载完成')
    loadUpdate(updateInfo)
  })

  ipc.on('startInstall',()=>{
    destroyAllViews()
    // save the window size for the next launch of the app
    saveWindowBounds()
    autoUpdater.quitAndInstall()
    app.quit()
  })
  // ipc.on('quitAndInstall',(event)=>{
  //   console.log('退出并执行升级')
  //   autoUpdater.quitAndInstall()
  // })
  ipc.on('closeUpdate',()=>{
    updaterWindow.close()
  })
}


