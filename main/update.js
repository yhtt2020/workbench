const { autoUpdater } = require('electron-updater')
let updaterWindow=null
function loadUpdate(updateInfo){
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
  updaterWindow.setMenu(null)
  updaterWindow.webContents.loadURL('file://' + __dirname + "/pages/update/index.html")
  updaterWindow.on('ready-to-show',()=>{
    updaterWindow.show()
    updaterWindow.webContents.send('getInfo',updateInfo)

  })
  updaterWindow.focus()
}
//app.whenReady().then(()=>loadUpdate())
// 自动检测升级机制
app.whenReady().then(()=>{
  if(isDevelopmentMode){
    //如果是开发环境，直接不检测，如需调试升级工具，将此处return注释掉即可
    return
  }
  let updateInfo={}
  autoUpdater.logger=electronLog
  autoUpdater.checkForUpdates().then((updateInfo)=>{
    //检测到可以升级，则发送升级的信息到updateWindow
    updateInfo={
      version:updateInfo.updateInfo.version,
      releaseDate:updateInfo.updateInfo.releaseDate
    }
  }).catch((err)=> {
    //console.log(err)
    })
 autoUpdater.on('error',(err)=>{
   sidePanel.get().webContents.send('message',{type:'error',config:{content:"升级文件下载失败，重启软件后重试。",key:"update"}})
 })

  autoUpdater.on('update-available',(data)=>{
    updateInfo=data
    //console.log(updateInfo)
    sidePanel.get().webContents.send('message',{type:'success',config:{content:"有新版本可用，系统将在后台自动下载。",key:"update"}})
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
  autoUpdater.on("error", (error) => {
    //console.log(`升级失败: ${error}`)
    let errInfo=''
    if(error.code===2){
      errInfo="软件包名无法验证，"
    }
    sidePanel.get().webContents.send('message',{type:'info',config:{content:"系统升级失败，"+errInfo+"请重启后重试。",key:"update"}})
  });
  // ipc.on('quitAndInstall',(event)=>{
  //   console.log('退出并执行升级')
  //   autoUpdater.quitAndInstall()
  // })
  ipc.on('closeUpdate',()=>{
    updaterWindow.close()
  })

})


