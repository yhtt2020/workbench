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
  const markdb = require(__dirname + '/src/util/markdb.js')
  markdb.init(app.getPath('userData'))
  const guideRes = markdb.db.get('guideSchedule.hashId').value()
  if(!guideRes) {
    markdb.db.set('guideSchedule', {
      hashId: nanoid(),
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
    return markdb.db.get('guideSchedule').value()
  })


  ipc.on('guideMigration', (event, args) => {
    mainWindow.webContents.send('bookmarkMigration', args)
  })

  /**
   * 浏览器主进程中各任务完成后需要调用的函数
   * @param {string} guideName lowdb中set的键名 如'guideSchedule.modules.noobGuide.accountLogin'
   */
  function afterGuide(guideName) {
    markdb.db.set(guideName, true).write()
    if(global.fromRender && global.fromRender.guide) {
      global.fromRender.guide.send('scheduleRefresh', markdb.db.get('guideSchedule').value())
    }
  }

  //--------------------------------------------------------------------->以下myf

  function sendIPCToMainWindow(action, data) {
    mainWindow.webContents.send(action, data || {})
  }

  ipc.on('guideTasks', () => {
    sidePanel.get().webContents.send('guide',0)
  })

  ipc.on('guideGlobalSearch', () => {
    sidePanel.get().webContents.send('guide',1)
  })
  ipc.on('guideDesktop', () => {
    mainWindow.webContents.send('addTab','ts://newtab')
    setTimeout(()=>{
      sidePanel.get().webContents.send('guideDesktop')
    },1000)
  })
  ipc.on('guideSpace', () => {
    sidePanel.get().webContents.send('guide',3)
  })
  ipc.on('guideApply', () => {
    sidePanel.get().webContents.send('guideApplyFirst')
  })
  ipc.on('guideTeam', () => {
    sidePanel.get().webContents.send('guide',5)
  })
  ipc.on('addTaskCareer',(event,args)=>{
    if(args===1){
      sendIPCToMainWindow('addTaskCareer',{
        task:[{
          taskName:'开发社区',
          // tabTitle:['PMCAFF','Product Hunt','起点课堂','每日报告'],
          url:['https://github.com','https://blog.csdn.net','https://gitee.com','https://segmentfault.com','https://www.v2ex.com']
        },{
          taskName:'常用工具',
          url:['https://www.postman.com','https://www.gitbook.com','https://www.jianshu.com','https://note.youdao.com','https://www.bt.cn']
        }]
      })
    }
    if(args===2){
      sendIPCToMainWindow('addTaskCareer',{
        task:[{
          taskName:'灵感创意',
          // tabTitle:['PMCAFF','Product Hunt','起点课堂','每日报告'],
          url:['https://uiiiuiii.com/inspiration','https://www.pinterest.com','https://www.zcool.com.cn','https://huaban.com','https://www.ui.cn']
        },{
          taskName:'常用工具',
          url:['https://lanhuapp.com','https://js.design','https://ant.design/index-cn','https://www.fococlipping.com','https://www.iconfont.cn']
        }]
      })
    }
    if(args===3){
      sendIPCToMainWindow('addTaskCareer',{
        task:[{
          taskName:'综合咨讯',
          // tabTitle:['PMCAFF','Product Hunt','起点课堂','每日报告'],
          url:['https://www.huxiu.com','https://www.toutiao.com','https://www.zhihu.com','https://index.baidu.com/v2/index.html#/','https://www.newrank.cn']
        },{
          taskName:'常用工具',
          url:['https://creator.douyin.com','https://www.zhihu.com/signin?next=%2Fcreator','https://baijiahao.baidu.com','https://mp.toutiao.com/','https://mp.weixin.qq.com']
        }]
      })
    }
    if(args===4){
      sendIPCToMainWindow('addTaskCareer',{
        task:[{
          taskName:'常用网站',
          // tabTitle:['PMCAFF','Product Hunt','起点课堂','每日报告'],
          url:['https://www.bt.cn','https://blog.csdn.net','https://click.aliyun.com/se/1011747345/','https://cloud.tencent.com','https://www.yunweipai.com']
        }]
      })
    }
    if(args===5){
      sendIPCToMainWindow('addTaskCareer',{
        task:[{
          taskName:'行业动态',
          // tabTitle:['PMCAFF','Product Hunt','起点课堂','每日报告'],
          url:['https://www.pmcaff.com','https://www.producthunt.com','https://www.qidianla.com/index/main.html','https://www.mrbaogao.com']
        },{
          taskName:'常用工具',
          url:['https://wj.qq.com','https://jinshuju.net','https://818ps.com','https://lanhuapp.com','https://modao.cc/dashboard/me']
        }]
      })
    }
    if(args===6){
      sendIPCToMainWindow('addTaskCareer',{
        task:[{
          taskName:'常用网站',
          // tabTitle:['PMCAFF','Product Hunt','起点课堂','每日报告'],
          url:['https://www.zhihu.com','https://www.qcc.com','https://aiqicha.baidu.com/','https://www.tianyancha.com/','https://wx.qq.com']
        }]
      })
    }
    if(args===7){
      sendIPCToMainWindow('addTaskCareer',{
        task:[{
          taskName:'测试资源',
          // tabTitle:['PMCAFF','Product Hunt','起点课堂','每日报告'],
          url:['https://www.pmcaff.com','https://www.producthunt.com','https://www.qidianla.com/index/main.html','https://www.mrbaogao.com']
        },{
          taskName:'常用工具',
          url:['https://wj.qq.com','https://jinshuju.net','https://818ps.com','https://lanhuapp.com','https://modao.cc/dashboard/me']
        }]
      })
    }
    if(args===8){
      sendIPCToMainWindow('addTaskCareer',{
        task:[{
          taskName:'常用网站',
          // tabTitle:['PMCAFF','Product Hunt','起点课堂','每日报告'],
          url:['https://bilibili.com','https://www.zhihu.com','https://www.toutiao.com','https://www.iqiyi.com','https://www.yuque.com']
        }]
      })
    }
  })

  ipc.on('blockSelect',(event,args)=>{

    mainWindow.webContents.send('blockSetting',args)
  })



})

