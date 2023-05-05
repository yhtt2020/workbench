const { autoUpdater } = require('electron-updater')
const {app,Notification,ipcMain:ipc,BrowserWindow,net}=require('electron')
let updaterWindow = null
global.initedUpdater=false
global.showUpdateWindow=false
class Updater {
  showedError = false
  //升级数据
  updateData
   showError (error, tag = 'check') {
    if (!net.online) {
      const content = {
        title: '自动更新',
        body: '当前为离线状态，自动更新程序暂不检测更新，请联网后重启应用检测。'
      }
      const notification = new Notification(content)
      notification.show()
      return
    }
    let errInfo = '未知'
    if (error.code === 2) {
      errInfo = '软件包名无法验证'
    }
    if ( this.showedError === false) {
      const content = {
        title: '自动更新',
        body: '自动更新程序意外终止,错误原因： ' + errInfo + ' ，将为您打开产品官网www.apps.vip，请至官网手动下载最新版本更新。'
      }
      const notification = new Notification(content)
      notification.show()
      this.showedError = true
      sendIPCToMainWindow(mainWindow, 'addTab', {
        url: 'https://www.apps.vip/#download'
      })
    }
  }

  /**
   * 检查更新
   * @param showWindow 显示更新窗口
   */
  checkUpdate (showWindow = false) {
    global.showUpdateWindow=showWindow
    //
    // if (isDevelopmentMode) {
    //   // 如果是开发环境，直接不检测，如需调试升级工具，将此处return注释掉即可
    //   return
    // }
    autoUpdater.logger = require('electron-log')

    autoUpdater.checkForUpdates().then((checkResult) => {
      // 检测到可以升级，则发送升级的信息到updateWindow
      this.updateData = {
        version: checkResult.updateInfo.version,
        releaseDate: checkResult.updateInfo.releaseDate
      }
    }).catch((error) => {
      this.showError(error, 'checkError')
    })

    if(!global.initedUpdater){
      global.initedUpdater=true
      autoUpdater.on('error', (error) => {
        this.showError(error, 'error')
      })
      autoUpdater.on('update-available', (data) => {
        this.updateData = data
        // console.log(updateInfo)
        setTimeout(() => {
          const content = {
            title: '自动更新',
            body: '有新版本可用，将为您准备更新。'
          }
          const notification = new Notification(content)
          notification.show()
        }, 1000)
      })
      autoUpdater.on('update-downloaded', (event, releaseEvents, releaseName, releaseDate, updateUrl, quitAndUpdate) => {
        // ipc.on('updateNow',(e,arg)=>{
        //   autoUpdater.quitAndInstall()
        // })
        // console.log('update下载完成')
        this.loadUpdate(this.updateData)
      })
      autoUpdater.on('update-not-available', (data) => {
        if (global.showUpdateWindow) {
          this.updateData = data
          // console.log(updateInfo)
          this.loadUpdate(data)
        }
      })
    }
    // autoUpdater.on('download-progress',(progressObj)=>{
    //   updaterWindow.webContents.send('downloadProgress',progressObj)
    // })
  }

  loadUpdate (updateInfo) {
    if (!updaterWindow) {
      updaterWindow = new BrowserWindow({
        parent: mainWindow,
        width: 500,
        height: 580,
        resizable: false,
        visible: false,
        acceptFirstMouse: true,
        webPreferences: {
          // preload: path.join(__dirname, '/pages/update/inde.js'),
          nodeIntegration: true,
          contextIsolation: false,
          additionalArguments: [
            '--user-data-path=' + userDataPath,
            '--app-version=' + app.getVersion(),
            '--app-name=' + app.getName(),
            ...((isDevelopmentMode ? ['--development-mode'] : []))
          ]
        }
      })
      updaterWindow.on('close', () => updaterWindow = null)
      updaterWindow.setMenu(null)
      updaterWindow.webContents.loadURL('file://' + __dirname + '/../../pages/update/index.html')
      updaterWindow.on('ready-to-show', () => {
        updaterWindow.show()
        updaterWindow.webContents.send('getInfo', { updateInfo: updateInfo, currentVersion: app.getVersion() })
        if (isDevelopmentMode) {
          // updaterWindow.openDevTools()
        }
      })
      updaterWindow.focus()
    } else {
      updaterWindow.focus()
    }
  }
}

app.whenReady().then(() => {
  ipc.on('startInstall', () => {
    global.destroyAllViews()
    // save the window size for the next launch of the app
    saveWindowBounds()
    autoUpdater.quitAndInstall()
    app.quit()
  })
  // ipc.on('quitAndInstall',(event)=>{
  //   console.log('退出并执行升级')
  //   autoUpdater.quitAndInstall()
  // })
  ipc.on('closeUpdate', () => {
    if (updaterWindow) {
      updaterWindow.close()
    }
  })

  ipc.on('checkUpdate',()=>{
    let updater=new Updater()
    updater.checkUpdate(true)
  })
})
module.exports=Updater
