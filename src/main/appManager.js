const path = require('path')
const fs = require('fs')
const { app, BrowserWindow, BrowserView, nativeImage, Notification } = require('electron')

const remote = require('@electron/remote/main')
const _ = require('lodash')
const SaApp = require('./saAppClass')
const appModel = require('../model/appModel')
appModel.initDb()
const userModel = require('../model/userModel')
const ipc = require('electron').ipcMain
const ipcMessageMain = require('./ipcMessageMain.js')

/**
 * 运行中的应用窗体，结构{window:窗体对象,saApp:独立窗体app对象}
 * @type {*[]}
 */
let processingAppWindows = []//运行中的应用

let notificationSettingStatus = null
let protocolManager = require('./protocolManager.js')

class AppManager {
  dockBadge = 0
  settingWindow = null
  protocolManager = protocolManager
  saApps = []

  /**
   * 启动自启动的应用
   * @returns {Promise<void>}
   */
  async executeAutoRunApps () {
    let apps = await appModel.getAutoRunApps()
    apps.forEach(app => {
      appManager.openApp(app.nanoid, true, app)
    })
  }

  async executeAppByPackage (pkg, cb) {
    let app = await appModel.get({ package: pkg })
    if (app) {
      appManager.openApp(app.nanoid, false, app, undefined, cb)
    }
  }

  /**
   * 朝运行中的应用发送IPC
   * @param pkg
   * @param event
   * @param args
   */
  sendIPCToApp (pkg, event, args) {
    let win = this.getWindowByPackage(pkg)
    if (win) {
      win.view.webContents.send(event, args)
    } else {
      return false
    }
  }

  /**
   * 单个更新app信息
   * @param id
   * @param saApp
   */
  updateSaApp (id, saApp) {
    for (let i = 0; i < processingAppWindows.length; i++) {
      if (processingAppWindows[i].saApp.nanoid === id) {
        processingAppWindows[i].saApp = saApp
        return true
      }
    }
    return false
  }

  /**
   * 聚焦窗体
   * @param windowId
   */
  focusWindow (windowId) {
    processingAppWindows.forEach((item) => {
      if (item.saApp.windowId === windowId) {
        if (!item.window.isVisible()) {
          item.window.show()
        }
        item.window.focus()
        if (barrageManager)
          barrageManager.changeUrl(item.saApp.url)
      }
    })
  }

  /**
   * 消息提示的前置处理，决定是否弹窗提示
   * @param {array} settingStatus 消息设置状态 (notificationSettingStatus对象)
   * @param app
   * @param {object} message 消息体
   */
  beforeEachNotification (settingStatus, app, args) {
    //前置判断
    let packageMap = {
      'com.thisky.group': 1,
      'com.thisky.com': 2
    } //增加一个id和packageMap来兼容新的api的定位方式
    let message = args.options
    if (settingStatus) {
      let index = settingStatus.findIndex(v => v.appId === packageMap[app.package])
      let childIndex = settingStatus[index].childs.findIndex(v => {
        return v.title === message.category
      })

      if (settingStatus[index].notice && settingStatus[index].childs[childIndex].notice) {
        //消息中心的收录做在这里
        if (app.package === 'com.thisky.group') {
          SidePanel.send('storeMessage', {
            title: message.title,
            body: message.body,
            indexName: message.indexName ?? null,
            avatar: message.icon ? message.icon.length > 0 ? message.icon : '' : '',
            type: 'groupChat'
          })
        } else if (app.package === 'com.thisky.com') {
          SidePanel.send('storeMessage', {
            title: message.title,
            body: message.body,
            avatar: message.avatar ? message.avatar.length > 0 ? message.avatar : '' : '',
            type: 'community'
          })
        }
      }

      return true
    }
    return false
  }

  getSaApp (nanoid) {
    return this.saApps.find(app => {
      return app.instance.info.nanoid === nanoid
    })
  }

  /**
   * 发送应用消息，进行提示，并给应用加上图标
   * @param appId
   * @param option  option.body为消息体  可参考此处参数说明 https://www.electronjs.org/zh/docs/latest/api/notification
   * @param ignoreWhenFocus 是否在窗体可见的时候直接跳过消息提示和badge设置，仅添加到消息记录，默认为false
   */
  async notification (appId = 0, option = {
    title: '应用消息', body: '消息内容'
  }, ignoreWhenFocus = false) {
    let saAppInstance = this.getSaApp(appId)
    let logoUri = await saAppInstance.getLogoUri()
    option.icon = option.icon ? option.icon : nativeImage.createFromPath(logoUri)
    let saAppWindow = appManager.getWindowByAppId(appId)
    if (ignoreWhenFocus && saAppWindow.isFocused()) {
      //不提示，不加badage，仅添加到消息记录
    } else {
      //否则则推送消息并设置badge
      let noti = Notification(option)

      noti.on('click', (e) => {
        let saApp = appManager.getSaAppByAppId(appId)
        appManager.openApp(appId, false, saApp)
      })
      noti.show()
      //add给badge进行加减调试，优先使用add，存在add则badge参数无效; badge强行设置badge的值，不推荐使用。
      appManager.incAppBadge(appId, 1)
    }

  }

  /**
   * 将app的badge+1，并更新dock中的badge
   * @param appId
   * @param add
   */
  incAppBadge (appId = 0, add = 1) {
    processingAppWindows.forEach(processApp => {
      if (processApp.saApp.nanoid === appId) {
        processApp.saApp.badge = processApp.saApp.badge ? processApp.saApp.badge + add : add
      }
    })
    SidePanel.send('appBadge', { nanoid: appId, add: add })
    appManager.updateDockBadge()
  }

  /**
   * 清理app的Bandage
   * @param appId
   * @param add
   */
  clearAppBadge (appId = 0, add = 1) {
    processingAppWindows.forEach(processApp => {
      if (processApp.saApp.nanoid === appId) {
        processApp.saApp.badge = 0
      }
    })
    SidePanel.send('appBadge', { nanoid: appId, badge: 0 })
    appManager.updateDockBadge()
  }

  /**
   * 自动统计全部的app的badge，进行汇总
   */
  updateDockBadge () {
    if (process.platform === 'darwin') {
      let count = 0
      processingAppWindows.forEach(processApp => {
        count += processApp.saApp.badge ? processApp.saApp.badge : 0
      })
      count === 0 ? app.dock.setBadge('') : app.dock.setBadge(count.toString())
      appManager.dockBadge = count
    }
  }

  /**
   * 给当前dockBage+1，此操作可能导致不同步
   * @param add
   */
  incDockBadge (add = 1) {
    if (process.platform === 'darwin') {
      appManager.dockBadge += add
      app.dock.setBadge(appManager.dockBadge.toString())
    }
  }

  /**
   * 设置dock栏的badge，不建议直接使用，请使用updateDockBadge（更新统计）或者incDockBadge（单独增加值）
   * @param count
   */
  setDockBadge (count) {
    if (process.platform === 'darwin') {
      appManager.dockBadge = count
      app.dock.setBadge(appManager.dockBadge.toString())
    }
  }

  /**
   * 清理dock栏的badge，置零，不建议直接使用，这是临时性的，建议先调整每个应用的badge，然后使用updateDockBadge进行dock栏汇总更新
   */
  clearDockBadge () {
    if (process.platform === 'darwin') {
      app.dock.setBadge('0')
    }
  }

  /**
   * 隐藏窗体
   * @param windowId
   */
  hideWindow (windowId) {
    processingAppWindows.forEach((item) => {
      if (item.saApp.windowId === windowId) {
        if (item.window.isFullScreen()) {
          item.window.setFullScreen(false)
          setTimeout(() => {
            item.window.hide()
          }, 600)
        } else {
          item.window.hide()
        }
      }
    })
  }

  /**
   * 切换窗体的可见度，适用于不需要确认窗体是否可见的场景
   * @param appId
   */
  toggleAppWindowVisible (appId) {
    let appWindow = appManager.getWindowByAppId(appId)
    if (appWindow.isVisible()) {
      appWindow.hide()
    } else {
      appWindow.show()
      appWindow.focus()
    }
  }

  /**
   * 隐藏窗体
   * @param appId
   */
  hideAppWindow (appId) {
    appManager.getWindowByAppId(appId).hide()
  }

  /**
   * 显示窗体
   * @param appId
   */
  showAppWindow (appId) {
    appManager.getWindowByAppId(appId).show()
    appManager.getWindowByAppId(appId).focus()
  }

  /**
   * 显示窗体
   * @param package
   */
  showAppWindowByPackage (pkg) {
    let window = appManager.getWindowByPackage(pkg)
    window.show()
    window.focus()
  }

  /**
   * 获得app运行状态
   * @param saAppId appId
   * @returns {boolean}
   */
  isAppProcessing (saAppId) {
    let processing = false
    processingAppWindows.forEach((item) => {
      if (item.saApp.nanoid === saAppId) {
        processing = !item.window.isDestroyed()
      }
    })
    return processing
  }

  /**
   * 获得app运行状态使用package判断
   * @param saAppId appId
   * @returns {boolean}
   */
  isAppProcessingByPackage (pkg) {
    let processing = false
    processingAppWindows.forEach((item) => {
      if (item.saApp.package === pkg) {
        processing = !item.window.isDestroyed()
      }
    })
    return processing
  }

  /**
   * 移除appWindow
   * @param saAppWindowId 窗体id,这里不适用appid，因为未来可能是多开窗体的
   */
  removeAppWindow (saAppWindowId) {
    for (let i = 0; i < processingAppWindows.length; i++) {
      if (processingAppWindows[i].saApp.windowId === saAppWindowId) {
        processingAppWindows.splice(i, 1)
      }

    }
  }

  /**
   * 设置原始app的设置，这里不考虑main中应用状态，还需要自行更新main的设置
   * @param saAppId
   * @param settings
   */
  setOriginAppSettings (saAppId, settings) {
    SidePanel.send('updateSetting', { nanoid: saAppId, settings: settings })
  }

  /**
   * 设置应用的设置，如果应用已存在，则会自动更新main中存储的设置，如果不存在，则直接调取originAppSetting，仅发送ipc去更新设置
   * @param saAppId 应用id
   * @param settings 应用设置，一个对象，类似{isAlwaysHide:true,runAtStart:true} 参考开发文档
   */
  setAppSettings (saAppId, settings = []) {
    let saApp = appManager.getSaAppByAppId(saAppId)
    if (saApp) {
      appManager.setOriginAppSettings(saAppId, settings)
      saApp.settings = Object.assign(saApp.settings, settings)
      appManager.updateSaApp(saAppId, saApp)
    } else {
      appManager.setOriginAppSettings(saAppId, settings)
    }
  }

  /**
   * 获取应用设置
   * @param saAppId 应用id
   * @param settingName 设置名称
   * @returns {*}
   */
  getAppSettings (saAppId, settingName) {
    for (let i = 0; i < processingAppWindows.length; i++) {
      if (processingAppWindows[i].saApp.nanoid === saAppId) {
        return processingAppWindows[i].saApp.settings[settingName]
      }

    }
  }

  /**
   * 通过窗体获得saApp实体
   * @returns {*}
   */
  getSaAppByWindowId (saAppWindowId) {
    for (let i = 0; i < processingAppWindows.length; i++) {
      if (processingAppWindows[i].saApp.windowId === saAppWindowId) {
        return processingAppWindows[i]
      }
    }
  }

  /**
   * 通过WindowId获得对应索引
   * @returns {number}
   */
  getIndexByWindowId (saAppWindowId) {
    for (let i = 0; i < processingAppWindows.length; i++) {
      if (processingAppWindows[i].saApp.windowId === saAppWindowId) {
        return i
      }
    }
  }

  /**
   * 获取saApp信息，通过appid
   * @returns {*}
   * @param nanoid
   */
  getSaAppByAppId (nanoid) {
    for (let i = 0; i < processingAppWindows.length; i++) {
      if (processingAppWindows[i].saApp.nanoid === nanoid) {
        return processingAppWindows[i].saApp
      }
    }
    return null
  }

  /**
   * 获取saApp信息，通过domain
   * @param {string} domian 主域名
   * @returns
   */
  getSaAppByDomian (domain) {
    for (let i = 0; i < processingAppWindows.length; i++) {
      if (processingAppWindows[i].saApp.url.includes(domain)) {
        return processingAppWindows[i].saApp
      }
    }
    return null
  }

  /**
   * 根据包名获得运行中的窗体
   * @param pkg
   */
  getWindowByPackage (pkg) {
    let find = _.find(processingAppWindows, (win) => {
      return win.saApp.package === pkg
    })
    if (!find) {
      return false
    }
    return find.window
  }

  /**
   * 通过appid获取到对应的运行的window对象
   * @param appId
   * @returns {null|*}
   */
  getWindowByAppId (nanoid) {
    for (let i = 0; i < processingAppWindows.length; i++) {
      if (processingAppWindows[i].saApp.nanoid === nanoid) {
        return processingAppWindows[i].window
      }
    }
    return null
  }

  /**
   * 通过windowId获取到对应的运行的window对象
   * @param windowId
   * @returns {null|*}
   */
  getWindowByWindowId (windowId) {
    for (let i = 0; i < processingAppWindows.length; i++) {
      if (processingAppWindows[i].saApp.windowId === windowId) {
        return processingAppWindows[i].window
      }
    }
    return null
  }

  /**
   *
   * @param id 应用id
   * @returns {Promise<{memoryUsage: {}, capture: (boolean|*)}>} 包含内存使用和快照
   */
  async getAppRunningInfo (id) {
    let saApp = appManager.getSaAppByAppId(id)
    if (!!!saApp) {
      return //如果不存在这个saApp
    }
    let capture = await appManager.capture(saApp.windowId)
    let memoryUsage = appManager.memoryUsageInfo(saApp.windowId)
    let info = {
      'capture': capture,
      'memoryUsage': memoryUsage
    }
    return info
  }

  /**
   * 获取应用内存信息
   * @param saAppWindowId
   */
  memoryUsageInfo (saAppWindowId) {
    let saApp = appManager.getSaAppByWindowId(saAppWindowId)
    let appWindow = saApp.window //窗体
    let memoryInfo = {}
    let allMetrics = app.getAppMetrics() //全局内存统计
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
    let pid = appWindow.webContents.getOSProcessId()
    allMetrics.forEach((met) => {
      if (met.pid === pid) {
        memoryInfo = met
      }
    })
    return memoryInfo
  }

  /**
   * 通过windowId给APP截图
   * @param saAppWindowId
   */
  async capture (saAppWindowId) {
    let saApp = appManager.getSaAppByWindowId(saAppWindowId)
    let imagePath = path.resolve(userDataPath + '/app/screen' + saApp.saApp.nanoid + '.jpg')
    if (saApp.window.isDestroyed()) {
      return
    }
    let capturedImage = await saApp.window.view.webContents.capturePage()
    if (capturedImage.isEmpty()) {
      //如果截图为空，则直接返回路径，而不进行覆盖，以提升截图成功率
      return imagePath
    }
    if (!fs.existsSync(userDataPath + '/app')) {
      fs.mkdirSync(userDataPath + '/app')
    }

    try {
      fs.writeFileSync(imagePath, capturedImage.toJPEG(50))
    } catch (err) {
      return false
    }
    return imagePath
  }

  openAppVite (path, additionalArguments = []) {
    function loadSettingWindow () {
      appManager.settingWindow = new BrowserWindow({
        width: 920,
        height: 800,
        acceptFirstMouse: true,
        webPreferences: {
          preload: ___dirname + '/src/preload/appSettingPreload.js',
          nodeIntegration: true,
          contextIsolation: false,
          enableRemoteModule: true,
          webSecurity: false,
          sandbox: false,
          safeDialogs: false,
          safeDialogsMessage: false,
          partition: null,
          additionalArguments: [
            '--user-data-path=' + userDataPath,
            ...additionalArguments
          ]
        }
      })
      appManager.settingWindow.setMenu(null)
      appManager.settingWindow.webContents.loadURL(render.getUrl('app.html#' + path))
      if (isDevelopmentMode) {
        //appManager.settingWindow.webContents.openDevTools()
      }
      appManager.settingWindow.on('close', () => {
        appManager.settingWindow = null
      })
    }

    if (appManager.settingWindow === null) {
      loadSettingWindow()
    } else {
      if (!appManager.settingWindow.isDestroyed()) {
        appManager.settingWindow.close()
        loadSettingWindow()
      }
    }
  }

  /**
   * 打开应用的设置窗口
   * @param appId
   */
  openSetting (appId) {
    this.openAppVite('/setting/'+appId, [
      '--app-version=' + app.getVersion(),
      '--app-name=' + app.getName(),
      '--app-id=' + appId
    ])
  }

  installInfo={}

  /**
   * 询问安装应用，在此阶段用户可以手动取消授权
   * @param appJson
   * @param from
   * @param callback
   * @param parent
   */
  installAppConfirm(appJson,from,callback,parent){
    let installWindow=new BrowserWindow({
      width: 350,
      height: 500,
      acceptFirstMouse: true,
      frame:false,
      parent:parent,
      webPreferences: {
        preload: ___dirname + '/src/preload/appSettingPreload.js',
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true,
        webSecurity: false,
        sandbox: false,
        safeDialogs: false,
        safeDialogsMessage: false,
        partition: null,
        additionalArguments: [
          '--user-data-path=' + userDataPath,
        ]
      }
    })
    installWindow.setMenu(null)
    appManager.installInfo.appJson=appJson
    appManager.installInfo.from=from

    installWindow.webContents.loadURL(render.getUrl('app.html#/installApp'))
    ipc.once('installAppReturn',(event,args)=>{
      callback(args)
    })
  }

  openAppManage(){
    this.openAppVite('/allApps', [
      '--app-version=' + app.getVersion(),
      '--app-name=' + app.getName(),
    ])
  }
  // findInPage(appId,args){
  //   let window=appManager.getWindowByAppId(appId)
  //   let view=window.view
  //
  //   view.webContents.findInPage(args.text,{
  //     forward:args.forward,
  //     findNext:args.findNext
  //   })
  // },
  // stopFindInPage(appId,action){
  //   let view=appManager.getWindowByAppId(appId).view
  //   view.webContents.stopFindInPage(action)
  // },
  releaseFocus (appId) {
    let window = appManager.getWindowByAppId(appId)
    window.webContents.focus()
  }

  appFocusView (appId) {
    let view = appManager.getWindowByAppId(appId).view
    view.webContents.focus()
  }

  /**
   * 关闭并删除应用
   * @param appId
   */
  deleteApp (appId) {
    appManager.closeApp(appId)
    setTimeout(() => {
      SidePanel.send('deleteApp', { nanoid: appId })
    }, 1000)
  }

  closeApp (nanoid) {
    let window = appManager.getWindowByAppId(nanoid)
    let saApp = appManager.getSaAppByAppId(nanoid)
    if (window && !window.isDestroyed()) {
      saApp.canClose = true
      appManager.removeAppWindow(saApp.windowId)
      let found = appManager.saApps.find((app) => {
        return app.instance.info.nanoid === nanoid
      })
      windowManager.close(found.windowName)//通过windowManager关闭实例
      appManager.saApps.splice(found, 1)
      SidePanel.send('closeApp', { nanoid: nanoid })
    }



  }

  closeAll () {
    let closed = 0
    processingAppWindows.forEach((item) => {
      if (!item.window.isDestroyed()) {
        appManager.closeApp(item.saApp.nanoid)
        closed++
      }
    })
    return closed
  }

  getViewWebPreferences (saApp) {
    let preload = ''
    if (saApp.isSystemApp) {
      if (!!!saApp.preload || saApp.preload === '') {
        preload = path.join(___dirname + '/pages/saApp/appPreload.js')
      } else {
        preload = path.join(___dirname + '/' + saApp.preload)
      }
    } else {
      preload = path.join(___dirname + '/pages/saApp/appPreload.js')
    }
    let partition = 'persist:webcontent'
    if (saApp.isSystemApp) {
      partition = null
    } else if (saApp.authAll.indexOf('node') > -1) {
      partition = 'persist:' + saApp.package
    }
    let webPreferences = {
      preload,
      nodeIntegration: saApp.isSystemApp || saApp.authAll.indexOf('node') > -1,
      contextIsolation: !saApp.isSystemApp && saApp.authAll.indexOf('webSecure') === -1,
      enableRemoteModule: true,
      sandbox: false,
      safeDialogs: false,
      backgroundColor: 'white',
      safeDialogsMessage: false,
      webSecurity: !saApp.isSystemApp && saApp.authAll.indexOf('webSecure') === -1, //系统应用关闭同源策略，不开启会报cros
      partition: partition,
      additionalArguments: [
        '--user-data-path=' + userDataPath,
        '--app-version=' + app.getVersion(),
        '--app-name=' + app.getName(),
        //'--saApp='+encodeURI(JSON.stringify(saApp)),
        ...((isDevelopmentMode ? ['--development-mode'] : [])),
      ]
    }

    return webPreferences

    //todo 兼容在应用内打开新窗体的操作
    appView.webContents.on('new-window', (event, url, frameName, disposition, options, additionalFeatures, referrer, postBody) => {
      if (!!!saApp.openNewWindow || saApp.openNewWindow === 'redirect') {
        //默认为重定向
        event.preventDefault()
        appView.webContents.loadURL(url)
        updateView(url)
      } else if (saApp.openNewWindow === 'allow') {
        event.preventDefault()
        //允许，则不修改默认事件
        const win = new BrowserWindow({
          webContents: options.webContents, // use existing webContents if provided
          show: false
        })
        win.webContents.on('new-window', (event, url) => {
          event.preventDefault()
          win.webContents.loadURL(url)
        })
        win.once('ready-to-show', () => win.show())
        win.setMenu(null)
        if (!options.webContents) {
          const loadOptions = {
            httpReferrer: referrer
          }
          if (postBody != null) {
            const { data, contentType, boundary } = postBody
            loadOptions.postData = postBody.data
            loadOptions.extraHeaders = `content-type: ${contentType}; boundary=${boundary}`
          }
          win.loadURL(url, loadOptions)
        }
        event.newGuest = win
      } else if (saApp.openNewWindow === 'deny') {
        //禁止打开
        event.preventDefault()
      }
    })
    // function _handleExternalProtocol(e, url, isInPlace, isMainFrame, frameProcessId, frameRoutingId){
    //   console.log(url)
    //   var knownProtocols = ['http', 'https', 'file', 'min', 'about', 'data', 'javascript', 'chrome','tsb'] // TODO anything else? tsb是新增的协议
    //   console.log('url=',url)
    //   if (!knownProtocols.includes(url.split(':')[0])) {
    //     var externalApp = app.getApplicationNameForProtocol(url)
    //     if (externalApp) {
    //       // TODO find a better way to do this
    //       // (the reason to use executeJS instead of the Electron dialog API is so we get the "prevent this page from creating additional dialogs" checkbox)
    //       var sanitizedName = externalApp.replace(/[^a-zA-Z0-9.]/g, '')
    //       if (appView.webContents.getURL()) {
    //         appView.webContents.executeJavaScript('confirm("' + l('openExternalApp').replace('%s', sanitizedName) + '")').then(function (result) {
    //           if (result === true) {
    //             electron.shell.openExternal(url)
    //           }
    //         })
    //       } else {
    //         // the code above tries to show the dialog in a browserview, but if the view has no URL, this won't work.
    //         // so show the dialog globally as a fallback
    //         var result = electron.dialog.showMessageBoxSync({
    //           type: 'question',
    //           buttons: ['OK', 'Cancel'],
    //           message: l('openExternalApp').replace('%s', sanitizedName).replace(/\\/g, '')
    //         })
    //
    //         if (result === 0) {
    //           electron.shell.openExternal(url)
    //         }
    //       }
    //     }
    //   }
    //   else {
    //     console.log('else=',url)
    //
    //   }
    // }
    // appView.webContents.on('did-start-navigation', _handleExternalProtocol)
    // /*
    // It's possible for an HTTP request to redirect to an external app link
    // (primary use case for this is OAuth from desktop app > browser > back to app)
    // and did-start-navigation isn't (always?) emitted for redirects, so we need this handler as well
    // */
    // appView.webContents.on('will-redirect', _handleExternalProtocol)

    // appView.webContents.on('found-in-page',(event,result)=>{
    //   appWindow.webContents.send('found-in-page',{data:result})
    // })

  }

  openApp (appId, background = false, app, option = {}, cb) {
    let saApp = appManager.getSaAppByAppId(appId)
    if (!!!saApp) {
      //首先必须是没运行的
      saApp = app
      appManager.executeApp(saApp, background, option, cb)
      // if (!saApp) {
      //   //如果不存在，直接运行
      //   appManager.executeApp(saApp, background)
      // } else if (!appManager.isAppProcessing(appId)) {
      //   //如果存在且未运行，则执行
      //   appManager.executeApp(saApp, background)
      // }
    } else {
      let window = appManager.getWindowByAppId(saApp.nanoid)
      appManager.focusWindow(saApp.windowId)

      if (option) {
        if (option.action) {
          appManager.protocolManager.handleAction(window, option.action, option)
        }
      }
      appManager.clearAppBadge(saApp.nanoid)
    }
  }

  getUrl (saApp) {
    //todo 真实实现debug_url功能
    if (saApp.debug_url) {

      //debug_url优先级最高
      return saApp.debug_url
    }
    let url = ''
    if (saApp.type === 'local' && saApp.package) {
      url = 'file://' + path.join(___dirname, saApp.url)
    } else {
      url = saApp.url
    }
    /**
     * 在dev模式下，group引用开发环境
     */
    if (saApp.package === 'com.thisky.group' && isDevelopmentMode) {
      // 当为开发环境下的时候，将团队强行更改为本地开发
      //todo 根据实际需求更改
      url = serverConfig.IM.FRONT_URL_DEV + serverConfig.IM.AUTO_LOGIN
    }
    if (saApp.package === 'com.thisky.fav' && isDevelopmentMode) {
      // 当为开发环境下的时候，将团队强行更改为本地开发
      //todo 根据实际需求更改
      url = 'file://' + path.join(___dirname, '/pages/fav/index.html')
      //saApp.url = 'http://localhost:8080/'
    } else if (saApp.package === 'com.thisky.fav') {
      url = 'file://' + path.join(___dirname, '/pages/fav/index.html')
    }
    if (saApp.package === 'com.thisky.fav' && isDevelopmentMode) {
      // appView.webContents.openDevTools()
    }
    return url
  }

  /**
   * 应用收到消息的回调
   * @param app
   * @param args
   * @returns {{msg: string, code: number}}
   */
  onNotice (app, args) {
    //需要前置处理消息设置的状态决定到底发不发消息
    const result = appManager.beforeEachNotification(notificationSettingStatus, app, args)
    if (result) {
      appManager.notification(app.nanoid, {
        title: args.options.title,
        body: args.options.body,
      }, typeof args.ignoreWhenFocus == 'undefined' ? false : args.ignoreWhenFocus)
      return { code: 200, msg: '成功' }
    } else {
      return { code: 500, msg: '失败' }
    }
  }

  /**
   * 将配置转为窗体参数
   * @param source
   * @returns {{}}
   */
  convertToWindowParams(source){
    let target={}
    target.maxWidth=Number(source.maxWidth)||undefined
    target.minWidth=Number(source.minWidth)|| undefined
    target.maxHeight=Number(source.maxHeight)||undefined
    target.minHeight=Number(source.minHeight) || undefined
    target.width=Number(source.width) || undefined
    target.height=Number(source.height) || undefined
    target.alwaysOnTop=source.top//将参数转换为可识别参数
    target.resizable=source.canResize
    console.log('target',target)
    return target

  }

  /**
   * 参考source的字段，移除target上面source不存在的字段
   * @param target
   * @param source
   */
  removeUndefinedKey(target,source){
    Object.keys(target).forEach((key)=>{
      if(typeof source[key] ==='undefined'){
        delete target[key]
      }
    })
    console.log('target fix',target)
  }

  /**
   * 执行应用
   * @param saApp 一个应用实体
   * @param background 是否后台运行，是则运行后不显示
   * @param option
   * @param cb 启动后的回调
   */
  async executeApp (saApp, background = false, option, cb) {
    saApp.settings = saApp.settings ? saApp.settings : {}
    let auth = []
    if (saApp.auth) {
      if(typeof saApp.auth ==='string'){
        saApp.auth=JSON.parse(saApp.auth)//防止老的string格式错误
      }
      if (saApp.auth.base) {
        auth = auth.concat(Object.keys(saApp.auth.base).map(key=>{
          if(saApp.auth.base[key]){
            return key
          }
        }))
      }
      if (saApp.auth.api) {
        auth = auth.concat(Object.keys(saApp.auth.api).map(key=>{
          if(saApp.auth.api[key]){
            return key
          }
        }))
      }
      saApp.authAll = auth
    } else {
      saApp.authAll = [] //修复后面的判断报错的问题
    }
    let url = this.getUrl(saApp)
    let name = appModel.getName(saApp)
    let config = saApp.window[saApp.window.defaultType]
    let windowParams = this.convertToWindowParams(config)

    if (saApp.window.defaultType === 'frameWindow') {
      //带边框窗体
      const defaultFrameWindowConfig = {
        //默认参数
        minWidth: 800,
        minHeight: 800,
        maxWidth: 800,
        maxHeight: 800,
        width: 800,
        height: 800,
        resizable: true,
        alwaysOnTop: false,
      }
      this.removeUndefinedKey(defaultFrameWindowConfig, windowParams)
      let frameWindowConfig = Object.assign(defaultFrameWindowConfig, windowParams)
      console.log(`frameWindowConfig`,frameWindowConfig)
      let appWindow = await windowManager.createFrameWindow({
        name: name,
        app: saApp,
        defaultBounds:{width:frameWindowConfig.width,height:frameWindowConfig.height},
        rememberBounds: true,
        url: url,
        viewOptions: {},
        viewWebPreferences: appManager.getViewWebPreferences(saApp),
        windowOption: Object.assign({
          trafficLightPosition: {
            x: 10, y: 7
          },
          show: !background,
          frame: false,
          titleBarStyle: 'hidden',
          acceptFirstMouse: true,
          alwaysOnTop: saApp.settings.alwaysTop ? saApp.settings.alwaysTop : frameWindowConfig.alwaysOnTop,//
        }, frameWindowConfig), onReadyToShow: (frame) => {
          frame.webContents.send('init', {
            url: saApp.url,
            nanoid: saApp.nanoid,
            title: saApp.name,
            windowId: saApp.windowId,
            app: saApp
          })
          if (cb) {
            cb()//执行启动后的回调
            cb = undefined
          }
        },
        onDomReady: () => {
          if (option) {
            if (option.action) {
              appManager.protocolManager.handleAction(appWindow, option.action, option)
            }
          }
        },
        frameWebPreferences: {
          nodeIntegration: true,
          contextIsolation: false,
          sandbox: false,
          preload: path.join(__dirname, '../preload/windowFramePreload.js'),
          partition: null,
          additionalArguments: [
            '--user-data-path=' + userDataPath,
            '--app-version=' + app.getVersion(),
            '--app-name=' + app.getName(),
            ...((isDevelopmentMode ? ['--development-mode'] : [])),
          ]
        }
      })
      let frame = appWindow.frame

      frame.on('close', (event, args) => {
        if (saApp.canClose) {
          return
        }
        if (saApp.settings.keepRunning) {
          appManager.hideWindow(saApp.windowId)
          event.preventDefault()
        } else {
          appManager.closeApp(saApp.nanoid)//暂时改为直接关闭
        }

      })
      frame.on('ready-to-show', (event) => {
        //连续4秒都获取一次截图，保障能够截取到最新的图
        appManager.capture(saApp.windowId)
        setTimeout(() => {
          if (!frame.isDestroyed())
            appManager.capture(saApp.windowId)
        }, 2000)
        setTimeout(() => {
          if (!frame.isDestroyed())
            appManager.capture(saApp.windowId)
        }, 3000)
        setTimeout(() => {
          if (!frame.isDestroyed())
            appManager.capture(saApp.windowId)
        }, 4000)
      })
      frame.on('blur', async (event) => {
        SidePanel.send('updateRunningInfo', {
          nanoid: saApp.nanoid,
          'info': await appManager.getAppRunningInfo(saApp.nanoid)
        })
      })

      SidePanel.send('executedAppSuccess', { app: saApp })
      saApp.windowId = appWindow.windowId

      processingAppWindows.push({
        window: frame,//在本地的对象中插入window对象，方便后续操作
        saApp: saApp,
        windowId: appWindow.windowId
      })
      let saAppInstance = new SaApp({
        info: saApp,
        type: 'frameWindow',
        windowName: name,
        window: frame,
        view: appWindow.view
      })
      this.saApps.push(saAppInstance)
    } else if (saApp.window.defaultType === 'window') {
      let defaultWindowConfig = {
        //默认参数
        minWidth: 400,
        minHeight: 400,
        maxWidth: 400,
        maxHeight: 400,
        width: 400,
        height: 400,
        resizable: true,
        alwaysOnTop: false,
      }
      this.removeUndefinedKey(defaultWindowConfig, windowParams)
      let windowConfig = Object.assign(defaultWindowConfig, windowParams)
      let appWindowInstance = await windowManager.create({
        name,
        app: saApp,
        rememberBounds: true,
        url: url,
        defaultBounds:{width:windowConfig.width,height:windowConfig.height},
        windowOption: {
          ...windowConfig,
          trafficLightPosition: {
            x: 10, y: 7
          },
          show: !background,
          frame: false,
          titleBarStyle: 'hidden',
          acceptFirstMouse: true,
          resizable: windowConfig.resizable,
          alwaysOnTop: saApp.settings.alwaysTop ? saApp.settings.alwaysTop : windowConfig.alwaysOnTop,
        },
        webPreferences: appManager.getViewWebPreferences(saApp),
        onReadyToShow: (window) => {
          window.webContents.send('init', {
            url: saApp.url,
            nanoid: saApp.nanoid,
            title: saApp.name,
            windowId: saApp.windowId,
            app: saApp
          })
          if (cb) {
            cb()//执行启动后的回调
            cb = undefined
          }
        }
      })
      console.log(`executedAppSuccess`,saApp)
      SidePanel.send('executedAppSuccess', { app: saApp })
      saApp.windowId = appWindowInstance.window.windowId

      if(saApp.window.window.blurAction==='close'){
        appWindowInstance.window.on('blur',()=>{
          appManager.closeApp(saApp.nanoid)
        })
      }else if(saApp.window.window.blurAction==='hide'){
        appWindowInstance.window.on('blur',()=>{
          appWindowInstance.window.hide()
        })
      }


      processingAppWindows.push({
        window: appWindowInstance.window,//在本地的对象中插入window对象，方便后续操作
        saApp: saApp,
        windowId: appWindowInstance.window.windowId
      })
      let saAppInstance = new SaApp({
        info: saApp,
        windowName: name,
        type: 'window',
        window: appWindowInstance.window,
        view: appWindowInstance.window
      })
      this.saApps.push(saAppInstance)
      //todo 继续开发window模式
    }

  }

  goChat (args) {
    let circleId = ''
    if (args && args.circleId) {
      circleId = args.circleId
    }

    const GROUP_PKG = 'com.thisky.group'

    async function loadChatUrl () {
      appManager.showAppWindowByPackage(GROUP_PKG)
      const appInfo = await appModel.get({ package: GROUP_PKG })
      let url = appInfo.url
      if (circleId) {
        const reg = /^http(s)?:\/\/(.*?)\//
        const host = reg.exec(appInfo.url)[0]
        url = `${host}?fid=${circleId}`
      }
      appManager.getWindowByPackage(GROUP_PKG).view.webContents.loadURL(url)
    }

    if (appManager.isAppProcessingByPackage(GROUP_PKG)) {
      appManager.showAppWindowByPackage(GROUP_PKG)
      //通过url跳转的方式
      loadChatUrl()
    } else {
      appManager.executeAppByPackage(GROUP_PKG, () => {
        loadChatUrl()
      })
    }
  }
}

/**
 * 执行一个应用
 */
app.whenReady().then(() => {
  let saAppApplyPermission = null
  remote.initialize()
  setTimeout(() => {
    appManager.executeAutoRunApps() //启动启动运行的应用们
  }, 3000)

  ipc.on('executeApp', (event, args) => {
    //这里传app，代表app未运行则直接执行起来
    try {
      if (args.app && args.app.id) {
        args.app.nanoid = args.app.id
      }
      appManager.openApp(args.app.nanoid, args.background, args.app, args.option)
    } catch (e) {
      console.warn(e)
    }

  })

  ipc.on(ipcMessageMain.saApps.createAppMenu, async (event, args) => {
    let appId = args.nanoid
    let saApp = appManager.getSaAppByAppId(appId)
    let appWindow = appManager.getWindowByAppId(appId)
    let app = await appModel.get(appId)
    ipc.once('gotDesks', (e, a) => {
      let template = [
        {
          label: '选项',
          submenu: [{
            type: 'checkbox',
            checked: app.settings['alwaysTop'],
            label: '窗口置顶',
            click () {
              if (app.settings['alwaysTop']) {
                appManager.setAppSettings(appId, {
                  'alwaysTop': false
                })
                if (appWindow && !appWindow.isDestroyed()) {
                  appWindow.setAlwaysOnTop(false)
                }
              } else {
                appManager.setAppSettings(appId, {
                  'alwaysTop': true
                })
                if (appWindow && !appWindow.isDestroyed()) {
                  appWindow.setAlwaysOnTop(true, 'screen-saver')
                }
              }
            }
          },
            {
              type: 'checkbox',
              checked: app.settings['showInSideBar'],
              label: '在左侧栏保留',
              click () {
                if (app.settings['showInSideBar']) {
                  appManager.setAppSettings(appId, {
                    'showInSideBar': false
                  })
                  //todo 更新左侧栏
                } else {
                  appManager.setAppSettings(appId, {
                    'showInSideBar': true
                  })
                  //todo 在左侧栏显示
                }
              }
            },
            {
              checked: app.settings['autoRun'],
              type: 'checkbox',
              label: '打开浏览器时运行',
              click () {
                if (app.settings['autoRun']) {
                  appManager.setAppSettings(appId, {
                    'autoRun': false
                  })
                } else {
                  appManager.setAppSettings(appId, {
                    'autoRun': true
                  })
                }
              }
            },
            // {
            //   type: 'separator'
            // },
            // {
            //   label:'发送到当前桌面'
            // }
          ]

        },
        {
          label: '设置',
          click () {
            appManager.openSetting(appId)
          }
        }
      ]
      let addToDeskMenus = []
      let desks = a.desks
      if (!!desks) {
        desks.forEach((desk) => {
          addToDeskMenus.push({
            id: desk.id,
            label: desk.name,
            click: () => {
              const appIcon = {
                type: 'app',
                data: {
                  type: 'saApp',
                  appId: app.nanoid,
                  name: app.name,
                  icon: app.logo,
                  summary: app.summary
                }
              }
              SidePanel.send('addToDesk', { app: appIcon, deskId: desk.id })

            }
          })
        })
      }
      template.push({
        id: 'addToDesk',
        label: '添加到桌面',
        submenu: addToDeskMenus
      })
      if (appWindow) {
        if (!appWindow.isDestroyed()) {
          template.unshift(
            {
              type: 'checkbox',
              checked: appWindow.isVisible(),
              label: (saApp.name.length > 18) ? saApp.name.substring(0, 15) + '...' : saApp.name,
              click () {
                appManager.toggleAppWindowVisible(appId)
              }
            }, {
              type: 'separator'
            }
          )

          if (appWindow.isVisible()) {
            template.push({
              label: '隐藏',
              click () {
                appManager.hideAppWindow(appId)
              }
            })
          } else {
            template.push({
              label: '显示',
              click () {
                appManager.showAppWindow(appId)
              }
            })
          }
          template.push({
            label: '重置窗口',
            click () {
              let bounds = renderPage.getMainWindowCenterBounds(appWindow.view.getBounds().width, appWindow.view.getBounds().height)
              appWindow.setPosition(bounds.x, bounds.y)
              appWindow.moveTop()
              appWindow.focus()
            }
          })
          template.push({
            type: 'separator'
          })
          template.push({
            label: '退出',
            click () {
              appManager.closeApp(appId)
            }
          })
        }
      } else {
        template.push({
          label: '打开',
          click () {
            appManager.executeApp(app)
          }
        })
      }
      let menu = require('electron').Menu.buildFromTemplate(template)

      menu.popup()
    })
    sendIPCToMainWindow('getDesks')

  })
  ipc.on(ipcMessageMain.saApps.openSetting, (event, args) => {
    appManager.openSetting(args.nanoid)
  })
  ipc.on('closeApp', (event, args) => {
    appManager.closeApp(args.nanoid)
  })
  ipc.on('getAppRunningInfo', async (event, args) => {
    SidePanel.send('updateRunningInfo', {
      nanoid: args.nanoid,
      'info': await appManager.getAppRunningInfo(args.nanoid)
    })
  })
  /**
   * 获取并更新一个app的截图
   */
  ipc.on('getAppCapture', (event, args) => {
    let saApp = appManager.getSaAppByAppId(args.nanoid)
    if (!!!saApp) {
      return //如果不存在这个saApp
    }
    let image = appManager.capture(saApp.windowId)
    if (!!image)
      SidePanel.send('updateAppCapture', { nanoid: saApp.saApp.nanoid, captureSrc: image })
  })
  /**
   * 获取到全部正在运行的app清单
   */
  ipc.on('getRunningApps', (event, args) => {
    let runningApps = []
    let windows = []
    processingAppWindows.forEach(window => {
      runningApps.push(window.saApp.nanoid)
      windows.push(window.saApp.windowId)
    })
    SidePanel.send('updateRunningApps', { runningApps: runningApps, windows: windows })
  })
  ipc.on(ipcMessageMain.saApps.deleteApp, (event, args) => {
    let appId = args.nanoid
    // if (appManager.settingWindow) {
    //   appManager.settingWindow.close()
    //   appManager.settingWindow = null
    // }
    mainWindow.focus()
    appManager.deleteApp(appId)
    event.returnValue=true
  })

  /**
   * ipc触发安装应用询问
   */
  ipc.on('installAppConfirm',(event,args)=>{
    appManager.installAppConfirm(args.appJson,'开发项目管理',(data)=>{
      if(data.result){
        SidePanel.send('installApp', { nanoid: data.nanoid, background: args.background })
        event.returnValue= { result:true,nanoid:data.nanoid }
      }else{
        event.returnValue= { result:false }
      }
    },BrowserWindow.fromWebContents(event.sender))
  })


  ipc.on(ipcMessageMain.saApps.installApp, (event, args) => {
    SidePanel.send('installApp', { nanoid: args.nanoid, background: args.background })
  })
  /**
   * 应用关闭前，将所有开启的窗体销毁掉
   */
  app.on('before-quit', () => {
    forceClose = true
    processingAppWindows.forEach((item) => {
      if (!item.window.isDestroyed()) {
        appManager.closeApp(item.saApp.nanoid)
      }
    })
  })

  ipc.handle('minimizeAppWindow', (event, args) => {
    appManager.getWindowByAppId(args.nanoid).minimize()
  })
  ipc.handle('closeAppWindow', (event, args) => {
    appManager.getWindowByAppId(args.nanoid).close()
  })
  ipc.handle('unmaximizeAppWindow', (event, args) => {
    appManager.getWindowByAppId(args.nanoid).unmaximize()
  })
  ipc.handle('maximizeAppWindow', (event, args) => {
    appManager.getWindowByAppId(args.nanoid).maximize()
  })
  ipc.handle('setFullScreenAppWindow', (event, args) => {
    appManager.getWindowByAppId(args.nanoid).setFullScreen(args.flag)

  })

  ipc.handle('saAppGetUserProfile', async () => {
    try {
      let currentRs = await userModel.getCurrent()
      if (currentRs.status === 1)
        return {
          code: 200,
          msg: '成功',
          data: Object.assign(currentRs.data.user_info, { accessToken: currentRs.data.token })
        }
    } catch (err) {
      console.error(err)
      return { code: 500, msg: '失败' }
    }
  })

  ipc.handle('saAppCheckBrowserLogin', async () => {
    try {
      let isLogged = await userModel.isLogged()
      if (!isLogged) {
        return { code: 500, msg: '浏览器未登录' }
      } else {
        return { code: 200, msg: '浏览器已登录' }
      }
    } catch (err) {
      console.error(err)
      return { code: 500, msg: '浏览器未登录' }
    }
  })

  ipc.on('saAppGoBack', (event, args) => {
    appManager.getWindowByAppId(args.nanoid).view.webContents.goBack()
  })

  ipc.on('saAppGoForward', (event, args) => {
    appManager.getWindowByAppId(args.nanoid).view.webContents.goForward()
  })

  ipc.on('saAppRefresh', (event, args) => {
    appManager.getWindowByAppId(args.nanoid).view.webContents.reload()
  })

  ipc.on('saAppHome', (event, args) => {
    let saApp = appManager.getSaAppByAppId(args.nanoid)
    appManager.getWindowByAppId(args.nanoid).view.webContents.loadURL(saApp.url)
  })
  // ipc.on('saAppFindInPage',(event,args)=>{
  //   appManager.findInPage(args.nanoid,args)
  // })
  //
  //  ipc.on('saAppStopFindInPage',(event,args)=>{
  //    appManager.stopFindInPage(args.nanoid,args.action)
  //  })

  ipc.on('saAppFocusView', (event, args) => {
    appManager.appFocusView(args.nanoid)
  })

  ipc.on('releaseFocus', (event, args) => {
    appManager.releaseFocus(args.nanoid)
  })

  ipc.handle('imPreloadReady', async () => {
    return await appModel.get({ package: 'com.thisky.group' })
  })

  //暂时先用domain去判断第三方应用的saApp，后续应用市场完全后前置一个用groupName去判断saApp
  ipc.handle('appPreloadReady', (event, args) => {
    return {
      saApp: appManager.getSaAppByDomian(args)
    }
  })

  ipc.on('webOsNotice', (event, args) => {
    //只有存在且notice为true，才允许转发webOsNotice到vuex处理
    let noticeWebOrigin = settings.get('noticeWebOrigin')
    let index = noticeWebOrigin.findIndex(v => v.link === args.url)
    if (index >= 0 && noticeWebOrigin[index].notice) {
      SidePanel.send('webOsNotice', args)
    }
  })

  ipc.on('notificationSettingStatus', (event, args) => {
    notificationSettingStatus = args
  })

  ipc.handle('saAppOpenSysApp', (event, args) => {
    appManager.goChat(args)
  })

  ipc.on('channelReloadGroup', () => {
    if (appManager.isAppProcessing(1)) {
      appManager.getWindowByAppId(1).view.webContents.send('reloadGroup')
    }
  })

  ipc.handle('saAppTabLinkJump', (event, args) => {
    sendIPCToWindow(mainWindow, 'tabNavigateTo', { url: args.url })
    return { code: 200, msg: '成功' }
  })

  ipc.handle('saAppHideApp', (event, args) => {
    try {
      appManager.getWindowByAppId(args.appId).hide()
      return { code: 200, msg: '成功' }
    } catch (err) {
      return { code: 500, msg: '失败' }
    }
  })

  ipc.on('handleFileAssign', (event, args) => {
    //转发到sidePanel
    appManager.protocolManager.handleFileAssign(args.type, args.args, args.target)
  })

  //处理TSB协议，对象传入url参数即可
  ipc.on('handleTsbProtocol', (event, args) => {
    appManager.protocolManager.handleProtocol(args.url)
  })

  app.whenReady().then(() => {
    //注册tsb协议
    appManager.protocolManager.initialize(SidePanel)
  })

  let ApplyPermissionOptions
  ipc.handle('saAppOpenPermissionWindow', (event, args) => {
    try {
      if (saAppApplyPermission !== null) {
        saAppApplyPermission.close()
      }
      saAppApplyPermission = new BrowserWindow({
        minimizable: false,
        parent: appManager.getWindowByWindowId(args.windowId),
        width: 420,
        height: 250,
        maximizable: false,
        resizable: false,
        preload: ___dirname + '/pages/saApp/applyPermission/preload.js',
        webPreferences: {
          devTools: true,
          partition: 'persist:webcontent',
          nodeIntegration: true,
          contextIsolation: false,
          additionalArguments: [
            '--user-data-path=' + userDataPath,
            '--app-version=' + app.getVersion(),
            '--app-name=' + app.getName(),
            ...((isDevelopmentMode ? ['--development-mode'] : [])),
            '--saAppName=' + args.appName,
            '--saAppFavicon=' + args.favicon
          ]
        }
      })
      saAppApplyPermission.setMenu(null)
      saAppApplyPermission.webContents.loadURL('file://' + ___dirname + '/pages/saApp/applyPermission/index.html')
      saAppApplyPermission.on('close', () => {
        saAppApplyPermission = null
      })
      ApplyPermissionOptions = args
      return { code: 200, msg: '授权窗口打开成功' }
    } catch (err) {
      return { code: 500, msg: '授权窗口打开失败' }
    }
  })

  ipc.on('entityLogin', async (event, args) => {
    let returnData = {}
    let user = await userModel.getCurrent()
    if (user.status !== 1) return
    if (args.includes('publicUserInfo')) {
      returnData.userInfo = user.data.user_info
    }
    let data = {
      userToken: user.data.token,
      clientId: ApplyPermissionOptions.clientId,
      bindId: ApplyPermissionOptions.bindId,
      returnData
    }
    //if todo //args之所以一定要把permission传过来 为未来具体授权内容进行不同的返回
    appManager.getWindowByWindowId(ApplyPermissionOptions.windowId).view.webContents.send('replyEntityLogin', data)
  })

  ipc.on('closePermissionWin', () => {
    saAppApplyPermission.close()
  })

  ipc.on('openAppManage',()=>{
    appManager.openAppManage()
  })
  /**
   * 获取到当前正在安装中的应用信息
   */
  ipc.on('getInstallAppJson',(event,args)=>{
    event.sender.send('returnInstallAppJson',{appJson:appManager.installInfo.appJson,from:appManager.installInfo.from})
  })


})

module.exports = { AppManager }
