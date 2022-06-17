const dlog = require('electron-log');
const { clipboard } = require('electron');
const authApi = require(path.join(__dirname, './js/request/api/authApi.js'))
const storage = require('electron-localstorage');
const _path= path.join(app.getPath("userData"), app.getName()+"/", 'userConfig.json');
const _path_dir = path.dirname(_path);
const { nanoid } = require('nanoid');


if(!fs.existsSync(_path_dir)){
  try{
    fs.mkdirSync(_path_dir)
  }
  catch(e){ dlog.error(err) }
}
storage.setStoragePath(_path);
global.sharedPath = {extra:storage.getStoragePath()}   //remote官方建议弃用，全局变量在渲染进程中暂时没找到可以替换获取的方法，但是在主进程中全局electronGlobal对象能获取到

app.whenReady().then(()=>{
  //初始化一下此设备浏览器的新手引导进度信息
  const markDb = require(__dirname + '/src/util/markdb.js')
  markDb.init(app.getPath('userData'))
  const guideRes = markDb.db.get('guideSchedule.hashId').value()
  if(!guideRes) {
    markDb.db.set('guideSchedule', {
      hashId: nanoid(),
      medal: false,
      modules: {
        noobGuide: {
          accountLogin: false,
          career: false,
          migration: false,
          adBlocking: false,
          personalise: false
        },
        feature: {
          tasks: false,
          globalSearch: false,
          desktop: false,
          userSpace: false,
          apps: false,
          team: false
        }
      },
      migration: {
        chrome: false,
        edge: false
      }
    }).write()
  }

  //游览器登录
  ipc.on('loginBrowser', async (event, arg) => {
    let result={}
    try {
      const data = {
        code: arg
      }
      result = await authApi.loginBrowser(data)
      if(result.code === 1000) {
        storage.setItem(`userToken`, result.data.token)
        storage.setItem(`refreshToken`, result.data.refreshToken)
        storage.setItem(`expire_deadtime`, new Date().getTime() + result.data.expire * 1000)
        storage.setItem(`refreshExpire_deadtime`, new Date().getTime() + result.data.refreshExpire * 1000)
        storage.setItem(`userInfo`, result.data.userInfo)
      }
      event.reply('callback-loginBrowser', result)
      afterGuide('guideSchedule.modules.noobGuide.accountLogin')

    } catch (err) {
      dlog.error(err)
    }

  })
  //游览器登出
  ipc.on('logoutBrowser', async() => {
    storage.removeItem(`userToken`);
    storage.removeItem(`userInfo`)
    storage.removeItem(`refreshToken`)
    storage.removeItem(`expire_deadtime`)
    storage.removeItem(`refreshExpire_deadtime`)

    const ldb=require(__dirname+'/src/util/ldb.js')
    ldb.load(app.getPath('userData')+'/ldb.json')
    let firstSpace=ldb.db.get('spaces')[0].value()
    let oldUser=ldb.db.get('currentSpace.userInfo').value()
    console.log(oldUser)
    ldb.db.set('currentSpace.spaceId',firstSpace['id']).write()
    ldb.db.set('currentSpace.spaceType','local').write()
    ldb.db.set('currentSpace.userInfo', {}).write()
    ldb.db.get('users').remove({uid:oldUser.uid}).write()
    //1是往lumen发消息，让lumen退出
    appManager.getWindowByAppId(1).view.webContents.send('imLogout')

    await authApi.logoutBrowser()
  })

  //同步主进程本地文件的用户标识
  ipc.on('syncCurrentUser', (event, args) => {
    storage.setItem(`userToken`, args.token)
    storage.setItem(`refreshToken`, args.refreshToken)
    storage.setItem(`expire_deadtime`, args.expire_deadtime)
    storage.setItem(`refreshExpire_deadtime`, args.refreshExpire_deadtime)
    storage.setItem(`userInfo`, {
      avatar: args.avatar,
      id: args.id,
      uid: args.uid
    })
  })

  //分享组
  ipc.on('shareTask', async (event, arg) => {
    sidePanel.get().webContents.send('message',{type:'loading',config:{content:'正在生成分享链接。',key:"shareTask"}})
    try{
      const createRes = await authApi.shareTasks(arg)
      if(createRes.code === 1000) {
        clipboard.writeText(createRes.data.shareTask_link)
        sidePanel.get().webContents.send('message',{type:'success',config:{content:'复制成功，已为您自动排除系统页面。',key:"shareTask"}})
      }else{
        sidePanel.get().webContents.send('message',{type:"error",config:{content:'分享失败，服务器繁忙。',key:"shareTask"}})

      }
    }
    catch(err){
      sidePanel.get().webContents.send('message',{type:"error",config:{content:'分享失败!',key:"shareTask"}})
      dlog.error(err)
    }
  })

  //检测node是否登录
  ipc.on('checkLogin', async(event, args) => {
    storage.getItem(`userToken`) ? event.reply('callback-checkLogin', true) : event.reply('callback-checkLogin', false)
  })

  //Osx免登录
  ipc.on('autoLogin', async(event, args) => {
    const result = await authApi.autoLogin()
    event.reply('callback-autoLogin', result)
  })

  //IM免登录
  ipc.on('imAutoLogin', async(event, args) => {
    const result = await authApi.imAutoLogin()
    event.reply('callback-imAutoLogin', result)
  })

  //主进程的refreshToken成功后   主进程更新storage中的信息，并传到子进程中修改用户标识信息
  ipc.on('updateStorageInfo', (event, user) => {
    storage.setStoragePath(global.sharedPath.extra)
    storage.setItem(`userToken`, user.token)
    storage.setItem(`refreshToken`, user.refreshToken)
    storage.setItem(`expire_deadtime`, new Date().getTime() + user.expire * 1000)
    storage.setItem(`refreshExpire_deadtime`, new Date().getTime() + user.refreshExpire * 1000)
    storage.setItem(`userInfo`, user.userInfo)
    global.utilWindow.webContents.send('remakeCurrentUser', user)
  })

  //主进程的refreshToken也过期的时候 清空主进程中storage的信息，并传到子进程中修改用户标识信息
  ipc.on('clearStorageInfo', () => {
    storage.setStoragePath(global.sharedPath.extra)
    storage.clear()
    global.utilWindow.webContents.send('clearCurrentUser')
  })

  //------------------------------------------------------->以下用户引导通信部分
  //获取本地存储的当前设备新手引导进度信息
  ipc.handle('getNoobGuideSchedule', (event, args) => {
    //全局储存新手引导页窗体render的信息，后面需要用这个通道主动发回
    global.fromRender = {
      guide: event.sender
    }
    return markDb.db.get('guideSchedule').value()
  })


  ipc.on('guideMigration', (event, args) => {
    mainWindow.webContents.send('bookmarkMigration', args)
    ipc.on('afterMigration', (event, args) => {
      afterGuide('guideSchedule.modules.noobGuide.migration')
      if(global.fromRender && !global.fromRender.guide.isDestroyed()) {
        markDb.db.set(`guideSchedule.migration.${args}`, true).write()
        global.fromRender.guide.send('specificBrowserMigrationState', {
          browser: args,
          status: true
        })
      }
    })
  })

  ipc.on('openRedirectApps', (event, args) => {
    SidePanel.send('handleProtocol', args)
  })

  ipc.on('openImportHelper', () => {
    SidePanel.send('execImportHelper')
  })

  ipc.on('activeComplete', (event, args) => {
    afterGuide(`guideSchedule.modules.${args.moduleName}.${args.childName}`)
  })

  let firstGuideVideo
  ipc.on('firstGuideVideo', () => {
    firstGuideVideo = new BrowserWindow({
      show:false,
      backgroundColor:'#00000000',
      transparent: true,
      resizable:false,
      parent: mainWindow,
      frame: false,
      titleBarStyle: 'hidden',
      width: 800,
      height: 490,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      }
    })

    function computeBounds(parentBounds,selfBounds){
      let bounds={}
      bounds.x=parseInt((parentBounds.x+parentBounds.x+parentBounds.width)/2-selfBounds.width/2,0)
      bounds.y=parseInt((parentBounds.y+parentBounds.y+parentBounds.height)/2-selfBounds.height/2)
      bounds.width=parseInt(selfBounds.width)
      bounds.height=parseInt(selfBounds.height)
      return bounds
    }


    firstGuideVideo.setWindowButtonVisibility(false)
    firstGuideVideo.loadURL('file://'+path.join(__dirname,'/pages/mvideo/index.html'))
    firstGuideVideo.on('ready-to-show',()=>{
      firstGuideVideo.show()
      firstGuideVideo.setBounds(computeBounds(mainWindow.getBounds(),firstGuideVideo.getBounds()))
      callModal(firstGuideVideo)
    })
    firstGuideVideo.on('close', () => {
      callUnModal(firstGuideVideo)
      firstGuideVideo = null
    })
  })

  ipc.on('closeMvideo', () => {
    firstGuideVideo.close()
  })

  ipc.on('getMedal', () => {
    markDb.db.set('guideSchedule.medal', true).write()
  })

  /**
   * 浏览器主进程中各任务完成后需要调用的函数
   * @param {string} guideName lowdb中set的键名 如'guideSchedule.modules.noobGuide.accountLogin'
   */
  function afterGuide(guideName) {
    markDb.db.set(guideName, true).write()
    if(global.fromRender && !global.fromRender.guide.isDestroyed()) {
      global.fromRender.guide.send('scheduleRefresh', markDb.db.get('guideSchedule').value())
    }
  }

  //--------------------------------------------------------------------->以下myf

  function sendIPCToMainWindow(action, data) {
    mainWindow.webContents.send(action, data || {})
  }

  ipc.on('guideTasks', () => {
    SidePanel.send('guide',0)
  })

  ipc.on('guideGlobalSearch', () => {
    SidePanel.send('guide',1)
  })
  ipc.on('guideDesktop', () => {
    mainWindow.webContents.send('addTab','ts://newtab')
    setTimeout(()=>{
      SidePanel.send('guideDesktop')
    },1000)
  })
  ipc.on('guideSpace', () => {
    SidePanel.send('guide',3)
  })
  ipc.on('guideApply', () => {
    SidePanel.send('guideApplyFirst')
  })
  ipc.on('guideTeam', () => {
    SidePanel.send('guide',5)
  })

  ipc.on('addTaskCareer',(event,args)=>{
    sendIPCToMainWindow('addTaskCareer',args)
  })
  ipc.on('blockSelect',(event,args)=>{
    mainWindow.webContents.send('blockSetting',args)
  })
  ipc.on('siteTheme',(event,args)=>{
    mainWindow.webContents.send('themeSelect',args)
  })
  ipc.on('selectEngine',(event,args)=>{
    mainWindow.webContents.send('selectEngine',args)
  })
  ipc.on('enterGuide',(item,window)=>{
    sendIPCToWindow(window, 'enterGuide')
  })
  ipc.on('exitGuide',(item,window)=>{
    sendIPCToWindow(window, 'exitGuide')
  })

  ipc.on('guideLogin',()=>{
    SidePanel.send('guideLogin')
  })

//--------------------------------------------------------->myf状态管理部分


  ipc.on('careerState',()=>{
    afterGuide('guideSchedule.modules.noobGuide.career')
  })
  ipc.on('migrationState',()=>{
    afterGuide('guideSchedule.modules.noobGuide.migration')
  })
  ipc.on('adBlockingState',()=>{
    afterGuide('guideSchedule.modules.noobGuide.adBlocking')
  })
  ipc.on('personaliseState',()=>{
    afterGuide('guideSchedule.modules.noobGuide.personalise')
  })
  ipc.on('tasksState',()=>{
    afterGuide('guideSchedule.modules.feature.tasks')
  })
  ipc.on('searchState',()=>{
    afterGuide('guideSchedule.modules.feature.globalSearch')
  })
  ipc.on('appState',()=>{
    afterGuide('guideSchedule.modules.feature.apps')
  })
  ipc.on('desktopState',()=>{
    afterGuide('guideSchedule.modules.feature.desktop')
  })
  ipc.on('spaceState',()=>{
    afterGuide('guideSchedule.modules.feature.userSpace')
  })
  ipc.on('teamState',()=>{
    afterGuide('guideSchedule.modules.feature.team')
  })
})

