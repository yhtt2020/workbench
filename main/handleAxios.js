const dlog = require('electron-log');
const { clipboard } = require('electron');
const authApi = require(path.join(__dirname, './src/api/authApi.js'))
const _path= path.join(app.getPath("userData"), app.getName()+"/", 'userConfig.json');
const _path_dir = path.dirname(_path);
const userModel =  require(path.join(__dirname,'./src/model/userModel.js'))
const GuideModel = require(path.join(__dirname,'./src/model/guideModel.js'))


if(!fs.existsSync(_path_dir)){
  try{
    fs.mkdirSync(_path_dir)
  }
  catch(e){ dlog.error(err) }
}
//global.sharedPath = {extra:storage.getStoragePath()}   //remote官方建议弃用，全局变量在渲染进程中暂时没找到可以替换获取的方法，但是在主进程中全局electronGlobal对象能获取到
function sendIPCToMainWindow(action, data) {
  if(mainWindow && !mainWindow.isDestroyed())
  {mainWindow.webContents.send(action, data || {})}
}

let guideModel=null
app.whenReady().then(async () => {
  //初始化一下此设备浏览器的新手引导进度信息
  try {
    guideModel=new GuideModel()
    if (await userModel.isLogged()) {
      let schedule=await guideModel.getSchedule()
      schedule.modules.noobGuide.accountLogin=true
      await guideModel.setSchedule(schedule)
    }
  } catch (e) {
    console.error(e)
  }

  //游览器登录
  ipc.on('loginBrowser', async (event, arg) => {
    let result = {}
    try {
      let code = arg
      result = await userModel.loginWithCode(code)
      event.reply('callback-loginBrowser', result)
      afterGuide('noobGuide','accountLogin')
    } catch (err) {
      console.error('登录报错', err)
      dlog.error(err)
    }

  })
  //游览器登出
  ipc.on('logoutBrowser', async () => {
    //1是往lumen发消息，让lumen退出
    sendIPCToMainWindow('logout')
    appManager.sendIPCToApp('com.thisky.group', 'imLogout') //通知
    //await authApi.logoutBrowser()
  })

  //分享组
  ipc.on('shareTask', async (event, arg) => {
    sidePanel.get().webContents.send('message', { type: 'loading', config: { content: '正在生成分享链接。', key: "shareTask" } })
    try {
      const createRes = await authApi.shareTasks(arg)
      if (createRes.code === 1000) {
        clipboard.writeText(createRes.data.shareTask_link)
        sidePanel.get().webContents.send('message', {
          type: 'success',
          config: { content: '复制成功，已为您自动排除系统页面。', key: "shareTask" }
        })

        //statsh 分享标签组统计
        statsh.do({
          action: 'increase',
          key: 'taskBaseShare',
          value: 1
        })
      } else {
        sidePanel.get().webContents.send('message', {
          type: "error",
          config: { content: '分享失败，服务器繁忙。', key: "shareTask" }
        })
      }
    } catch (err) {
      sidePanel.get().webContents.send('message', { type: "error", config: { content: '分享失败!', key: "shareTask" } })
      dlog.error(err)
    }
  })

  //检测node是否登录
  ipc.on('checkLogin', async (event, args) => {
    event.reply('callback-checkLogin', await userModel.isLogged())
  })

  //Osx免登录
  ipc.on('autoLogin', async (event, args) => {
    const result = await authApi.autoLogin()
    event.reply('callback-autoLogin', result)
  })

  //IM免登录
  ipc.on('imAutoLogin', async (event, args) => {
    const result = await authApi.imAutoLogin()
    event.reply('callback-imAutoLogin', result)
  })

  function updateStorageInfo (user) {
    userModel.setCurrent(user)
    // storage.setStoragePath(global.sharedPath.extra)
    // storage.setItem(`userToken`, user.token)
    // storage.setItem(`refreshToken`, user.refreshToken)
    // storage.setItem(`expire_deadtime`, new Date().getTime() + user.expire * 1000)
    // storage.setItem(`refreshExpire_deadtime`, new Date().getTime() + user.refreshExpire * 1000)
    // storage.setItem(`userInfo`, user.userInfo)
    // global.utilWindow.webContents.send('remakeCurrentUser', user)
    //发送过去更新用户的信息
  }

  //主进程的refreshToken成功后   主进程更新storage中的信息，并传到子进程中修改用户标识信息
  ipc.on('updateUserInfo', (event, user) => {
    updateStorageInfo(user)
  })

  //主进程的refreshToken也过期的时候 清空主进程中storage的信息，并传到子进程中修改用户标识信息
  ipc.on('clearStorageInfo', () => {
    userModel.logout()
    global.utilWindow.webContents.send('clearCurrentUser')
  })

  //------------------------------------------------------->以下用户引导通信部分
  //获取本地存储的当前设备新手引导进度信息
  ipc.handle('getNoobGuideSchedule', async (event, args) => {
    //全局储存新手引导页窗体render的信息，后面需要用这个通道主动发回
    global.fromRender = {
      guide: event.sender
    }
    return await guideModel.getSchedule()
  })

  //第三栏来获取当前设备的新手引导进度
  ipc.handle('toolbarGetNoobGuideSchedule', async (event, args) => {
    return await guideModel.getSchedule()
  })

  ipc.handle('getOtherStatus', () => {
    let browserTabData = settings.get('browserTab') || null
    if (browserTabData && browserTabData.tabIdx === 0) {
      browserTabData = 'tstab'
    } else if (browserTabData && browserTabData.tabIdx === 1) {
      browserTabData = 'qntab'
    } else if (browserTabData && browserTabData.tabIdx === 2) {
      browserTabData = 'inftab'
    } else if (browserTabData && browserTabData.tabIdx === 3) {
      browserTabData = 'itab'
    } else {
      browserTabData = 'custom'
    }
    let data = {
      adBlockingLevel: settings.get('filtering') ? settings.get('filtering').blockingLevel : 0,
      siteTheme: settings.get('siteTheme') ? settings.get('siteTheme') : true,
      searchEngine: settings.get('searchEngine') ? settings.get('searchEngine').name : 'Bing',
      newTab: browserTabData ?? 'tstab'
    }
    return data
  })

  ipc.handle('getInfoBookmarkMigrationed', () => {
    return settings.get('bookmarkMigrationed')
  })

  ipc.on('guideMigration', (event, args) => {
    mainWindow.webContents.send('bookmarkMigration', args)
    ipc.on('afterMigration', async (event, args) => {
      settings.set('bookmarkMigrationed', true)
      afterGuide('noobGuide','migration')
      if (global.fromRender && !global.fromRender.guide.isDestroyed()) {
        let data = await guideModel.getSchedule()
        data.migration[args]=true
        await guideModel.setSchedule(data)
        global.fromRender.guide.send('specificBrowserMigrationState', {
          browser: args,
          status: true
        })
      }
    })
  })

  ipc.on('htmlImport', () => {
    mainWindow.webContents.send('renderHtmlImport')
  })

  async function calcGuideScedule () {
    let guideSchedule = await guideModel.getSchedule()
    let noobGuideObj = JSON.parse(JSON.stringify(guideSchedule.modules.noobGuide))
    let featureObj = JSON.parse(JSON.stringify(guideSchedule.modules.feature))
    let totalChildrenObj = Object.assign(noobGuideObj, featureObj)
    let percentage = Math.floor((Object.entries(totalChildrenObj).filter(v => v[1] === true).length) / (Object.keys(totalChildrenObj).length) * 100)
    return percentage
  }

  ipc.handle('getSidebarGuideScedule', async () => {
    return await calcGuideScedule()
  })

  ipc.handle('statshNoobGuide', async () => {
    return await guideModel.getSchedule()
  })

  ipc.on('openRedirectApps', (event, args) => {
    SidePanel.send('handleProtocol', args)
  })

  ipc.on('openImportHelper', () => {
    SidePanel.send('execImportHelper')
  })

  ipc.on('openFav', () => {
    SidePanel.send('execFav')
  })

  ipc.on('activeComplete', (event, args) => {
    afterGuide(args.moduleName,args.childName)
  })
  // ipc.on('enterFirstGuide',(item,window)=>{
  //   sendIPCToWindow(window, 'enterFirstGuide')
  // })
  let firstGuideVideo
  ipc.on('firstLoad', () => {
    let isOpenGuideVideo = settings.get('guideVideo')
    if (!isOpenGuideVideo) {
      settings.set('guideVideo', false)
    }

    if (settings.get('guideVideo') === false) {
      firstGuideVideo = new BrowserWindow({
        show: false,
        backgroundColor: '#00000000',
        transparent: true,
        resizable: false,
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

      function computeBounds (parentBounds, selfBounds) {
        let bounds = {}
        bounds.x = parseInt((parentBounds.x + parentBounds.x + parentBounds.width) / 2 - selfBounds.width / 2, 0)
        bounds.y = parseInt((parentBounds.y + parentBounds.y + parentBounds.height) / 2 - selfBounds.height / 2)
        bounds.width = parseInt(selfBounds.width)
        bounds.height = parseInt(selfBounds.height)
        return bounds
      }

      if (process.platform === 'darwin')
        firstGuideVideo.setWindowButtonVisibility(false)
      firstGuideVideo.loadURL('file://' + path.join(__dirname, '/pages/mvideo/index.html'))
      firstGuideVideo.on('ready-to-show', () => {
        firstGuideVideo.show()
        firstGuideVideo.setBounds(computeBounds(mainWindow.getBounds(), firstGuideVideo.getBounds()))
        callModal(firstGuideVideo)
      })
      firstGuideVideo.on('close', () => {
        callUnModal(firstGuideVideo)
        firstGuideVideo = null
      })
      settings.set('guideVideo', true)
    }
  })

  // let firstGuideVideo
  // ipc.on('firstGuideVideo', () => {
  //   firstGuideVideo = new BrowserWindow({
  //     show:false,
  //     backgroundColor:'#00000000',
  //     transparent: true,
  //     resizable:false,
  //     parent: mainWindow,
  //     frame: false,
  //     titleBarStyle: 'hidden',
  //     width: 800,
  //     height: 490,
  //     webPreferences: {
  //       nodeIntegration: true,
  //       contextIsolation: false,
  //     }
  //   })
  //
  //   function computeBounds(parentBounds,selfBounds){
  //     let bounds={}
  //     bounds.x=parseInt((parentBounds.x+parentBounds.x+parentBounds.width)/2-selfBounds.width/2,0)
  //     bounds.y=parseInt((parentBounds.y+parentBounds.y+parentBounds.height)/2-selfBounds.height/2)
  //     bounds.width=parseInt(selfBounds.width)
  //     bounds.height=parseInt(selfBounds.height)
  //     return bounds
  //   }
  //   if(process.platform==='darwin')
  //     firstGuideVideo.setWindowButtonVisibility(false)
  //   firstGuideVideo.loadURL('file://'+path.join(__dirname,'/pages/mvideo/index.html'))
  //   firstGuideVideo.on('ready-to-show',()=>{
  //     firstGuideVideo.show()
  //     firstGuideVideo.setBounds(computeBounds(mainWindow.getBounds(),firstGuideVideo.getBounds()))
  //     callModal(firstGuideVideo)
  //   })
  //   firstGuideVideo.on('close', () => {
  //     callUnModal(firstGuideVideo)
  //     firstGuideVideo = null
  //   })
  // })

  ipc.on('firstLoad', () => {
    mainWindow.webContents.send('firstLoad')
  })

  ipc.on('closeMvideo', () => {
    firstGuideVideo.close()
  })

  ipc.on('getMedal', async () => {
    let data = await guideModel.getSchedule()
    data.medal = true
    await guideModel.setSchedule(data)
  })

  ipc.on('isMedal', async () => {
    let data = await guideModel.getSchedule()
    SidePanel.send('callBackMedal', data.medal)
  })

  ipc.on('selectNewTab', (event, args) => {
    mainWindow.webContents.send('renderSelectNewTab', args)
  })

  /**
   * 浏览器主进程中各任务完成后需要调用的函数
   * @param module 模块名
   * @param key 子类
   */
  async function afterGuide (module,key) {
    let data = await guideModel.getSchedule()
    await guideModel.setModuleKey(module,key,true)

    if (mainWindow && !mainWindow.isDestroyed()) {

      mainWindow.webContents.send('scheduleRefresh', data)
      //todo 确认关闭主窗体的情况下能否完成引导
    }

    if (global.fromRender && !global.fromRender.guide.isDestroyed()) {
      global.fromRender.guide.send('scheduleRefresh', data)
      let percent= await calcGuideScedule()
      SidePanel.send('updateSidebarGuideScedule',percent)
    }
  }

  //--------------------------------------------------------------------->以下myf

  ipc.on('guideTasksFirst', async () => {
    let data = await guideModel.getSchedule()
    if (data.modules.feature.tasks === false) {
      SidePanel.send('guideTasks')
    }
  })
  ipc.on('guideGlobalSearchFirst', async () => {
    let data = await guideModel.getSchedule()
    if (data.modules.feature.globalSearch=== false) {
      SidePanel.send('guide', 1)
    }
  })
  ipc.on('guideDesktopFirst', async () => {
    let data = await guideModel.getSchedule()
    if (data.modules.feature.desktop === false) {
      mainWindow.send('addTab', { url: 'ts://newtab' })
      setTimeout(() => {
        SidePanel.send('guideDesktop')
      }, 1000)
    }
  })
  ipc.on('guideSpaceFirst', async () => {
    let data = await guideModel.getSchedule()
    if (data.modules.feature.userSpace === false) {
      SidePanel.send('guide', 3)
    }
  })

  ipc.on('guideApplyFirst', async () => {
    let data = await guideModel.getSchedule()
    if (data.modules.feature.apps === false) {
      SidePanel.send('guideApplyFirst')
    }
  })
  ipc.on('guideTeamFirst', async () => {
    let data = await guideModel.getSchedule()
    if (data.modules.feature.team === false) {
      SidePanel.send('guide', 5)
    }
  })

  ipc.on('guideTasks', () => {
    SidePanel.send('guideTasks')
  })

  ipc.on('guideGlobalSearch', () => {
    SidePanel.send('guide', 1)
  })
  ipc.on('guideDesktop', () => {
    mainWindow.webContents.send('addTab', { url: 'ts://newtab' })
    setTimeout(() => {
      SidePanel.send('guideDesktop')
    }, 1000)
  })
  ipc.on('guideSpace', () => {
    SidePanel.send('guide', 3)
  })
  ipc.on('guideApply', () => {
    SidePanel.send('guideApplyFirst')
  })
  ipc.on('guideTeam', () => {
    SidePanel.send('guide', 5)

  })

  ipc.on('addTasks', () => {
    setTimeout(() => {
      SidePanel.send('guide', 6)
    }, 800)
  })

  ipc.on('helpGuide', () => {
    SidePanel.send('guide', 7)
    settings.set('hasShowDirection', true)
  })

  ipc.on('recordCareer', (event, args) => {
    settings.set('career', args.title)
  })

  ipc.on('addTaskCareer', (event, args) => {
    settings.set('career', args.title)
    sendIPCToMainWindow('addTaskCareer', args)
  })
  ipc.on('openNewBackTab', () => {
    sendIPCToMainWindow('openNewBackTab')
  })

  ipc.on('blockSelect', (event, args) => {
    mainWindow.webContents.send('blockSetting', args)
    if (global.fromRender && !global.fromRender.guide.isDestroyed()) {
      global.fromRender.guide.send('updateSpecificItem', {
        name: 'adBlockingLevel',
        value: args
      })
    }
  })

  ipc.on('siteTheme', (event, args) => {
    mainWindow.webContents.send('themeSelect', args)
  })
  ipc.on('selectEngine', (event, args) => {
    mainWindow.webContents.send('selectEngine', args)
    if (global.fromRender && !global.fromRender.guide.isDestroyed()) {
      global.fromRender.guide.send('updateSpecificEngine', {
        name: 'searchEngine',
        value: args
      })
    }
  })
  ipc.on('enterGuide', (item, window) => {
    sendIPCToWindow(window, 'enterGuide')
  })
  ipc.on('exitGuide', (item, window) => {
    sendIPCToWindow(window, 'exitGuide')
  })
  // ipc.on('exitFirstGuide',()=>{
  //   mainWindow.webContents.send('exitFirstGuide')
  // })

  ipc.on('closeGuide', () => {
    mainWindow.webContents.send('closeGuide')
  })

  ipc.on('guideLogin', () => {
    SidePanel.send('guideLogin')
  })
  ipc.on('guideClose', () => {
    mainWindow.webContents.send('closeGuide')
  })

  ipc.on('valueCount', (event, args) => {
    sendIPCToMainWindow('valueCount', args)
    //mainWindow.webContents.send()
  })

  ipc.on('openNewGuide', () => {
    mainWindow.webContents.send('openNewGuide')
  })

//--------------------------------------------------------->myf状态管理部分

  ipc.on('careerState', () => {
    //afterGuide('guideSchedule.modules.noobGuide.career')
    afterGuide('noobGuide','career')
  })
  ipc.on('migrationState', () => {
    afterGuide('noobGuide','migration')
    //afterGuide('guideSchedule.modules.noobGuide.migration')
  })
  ipc.on('adBlockingState', () => {
    afterGuide('noobGuide','adBlocking')
    //afterGuide('guideSchedule.modules.noobGuide.adBlocking')
  })
  ipc.on('personaliseState', () => {
    afterGuide('noobGuide','personalise')
   // afterGuide('guideSchedule.modules.noobGuide.personalise')
  })
  ipc.on('tasksState', () => {
    afterGuide('feature','tasks')
    //afterGuide('guideSchedule.modules.feature.tasks')
  })
  ipc.on('searchState', () => {
    afterGuide('feature','globalSearch')
    //afterGuide('guideSchedule.modules.feature.globalSearch')
  })
  ipc.on('appState', () => {
    afterGuide('feature','apps')
    //afterGuide('guideSchedule.modules.feature.apps')
  })
  ipc.on('desktopState', () => {
    afterGuide('feature','desktop')
    //afterGuide('guideSchedule.modules.feature.desktop')
  })
  ipc.on('spaceState', () => {
    afterGuide('feature','userSpace')
    //afterGuide('guideSchedule.modules.feature.userSpace')
  })
  ipc.on('teamState', () => {
    afterGuide('feature','team')
    //afterGuide('guideSchedule.modules.feature.team')
  })
})

