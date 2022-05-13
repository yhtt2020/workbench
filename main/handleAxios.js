const dlog = require('electron-log');
const { clipboard } = require('electron');
const authApi = require(path.join(__dirname, './js/request/api/authApi.js'))
const storage = require('electron-localstorage');
const _path= path.join(app.getPath("userData"), app.getName()+"/", 'userConfig.json');
const _path_dir = path.dirname(_path);
if(!fs.existsSync(_path_dir)){
  try{
    fs.mkdirSync(_path_dir)
  }
  catch(e){ dlog.error(err) }
}
storage.setStoragePath(_path);
global.sharedPath = {extra:storage.getStoragePath()}   //remote官方建议弃用，全局变量在渲染进程中暂时没找到可以替换获取的方法，但是在主进程中全局electronGlobal对象能获取到

app.whenReady().then(()=>{
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
    } catch (err) {
      dlog.error(err)
    }

  })
  //游览器登出
  ipc.on('logoutBrowser', async(event, arg) => {
    const data = {
      code: arg
    }
    await authApi.logoutBrowser(data)
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
})

