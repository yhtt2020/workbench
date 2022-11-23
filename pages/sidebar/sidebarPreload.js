require('../../dist/localization.build.js')
require('../util/util.js').tools.getWindowArgs(window)
let userMode=require('../../src/model/userModel')
const electron = require('electron')
const ipc = electron.ipcRenderer

// const tsbSdk = require('../../js/util/tsbSdk.js')

// tsbSdk.listener({isSystemApp: true})


const { db } = require('../../js/util/database.js')
window.mainWindowId = 0 //主窗体id
window.l = l
window.db = db
const { themeSetting } = require('../util/theme')
const theme=require('./theme.js')
//将语言包的接口暴露给里面的页面
window.l = l
window.ipc = ipc
if (!!!localStorage.getItem('firstRun')) {
  ipc.send('wizard')
}

window.addEventListener('message', function (e) {
  if (!e.origin.startsWith('file://')) {
    return
  }
  let messageType = getMessageType(e.data)
  switch (messageType) {
    case 'getGlobal':
      ipc.send('getGlobal')
      break
    case 'openBookMarks':
      ipc.send('openBookmarks')
      break
    // case 'bringToFront':
    // 	ipc.send('bringSidebarToFront')
    // 	break
    // //case 'bringToBack':
    // 	ipc.send('bringSidebarToBack')
    // 	break
    // case 'bringToBackDelay':
    // 	ipc.send('bringSidebarToBackDelay') //延迟关闭
    // 	break
    case 'switchToTask':
      ipc.sendTo(mainWindowId, 'switchToTask', {
        id: e.data.id,
        index: e.data.index
      })
      break
    case 'switchToTab':
      ipc.sendTo(mainWindowId, 'switchToTab', {
        taskId: e.data.taskId ? e.data.taskId : null,
        tabId: e.data.tabId
      })
      break
    case 'resortTasks':
      ipc.sendTo(mainWindowId, 'resortTasks', {
        'droppedTaskId': e.data.droppedTaskId,
        'adjacentTaskId': e.data.adjacentTaskId
      })
      break
    case 'setting':
      ipc.send('openSetting')
      break
    case 'bell':
      ipc.send('openMessageCenter')
      break
    case 'home':
      ipc.send('openHome')
      break
    case 'help':
      ipc.send('openHelp')
      break
    case 'mobile':
      ipc.send('openMobile')
      break
    case 'addTab':
      ipc.send('addTab', { 'url': e.data.url })
      break
  }

})

let sidebarRestore = require('./sidebarRestore.js').initialize()

function getMessageType (data) {
  if (data && data.message)
    return data.message
  else
    return ''
}

let loaded = window.loaded
setInterval(function () {
  if (loaded === true) {
    ipc.send('getGlobal')
  }
}, 500)

ipc.on('receiveGlobal', function (e, data) {
  window.postMessage({
    message: 'receiveGlobal',
    data: data
  })
  mainWindowId = data.mainWindowId

})

ipc.on('addItem', function (e, data) {
  window.$store.state.items.push(data.item)
})
ipc.on('themeChange',(e,a)=>{
  if(a.status==='enable'){
    theme.enableDarkMode()
  }else{
    theme.disableDarkMode()
  }

})

ipc.on('refreshMyGroups', async () => {
  const currentUser = await db.system.where('name').equals('currentUser').first()
  await window.$store.dispatch('getGroups', {
    token: currentUser.value.token
  })
})

//读入当前登录的帐号
window.getCurrentUser= async function  getCurrentUser () {
   let userRs =await userModel.getCurrent()
  let user={}
  if (userRs.status) {
    user=userRs.data
    //兼容老版本优化
    user.fans=user.user_info.fans || 0
    user.postCount=user.user_info.postCount || 0
    user.follow=user.user_info.follow || 0
    user.grade= user.user_info.grade || {
      grade: 1
    }
    window.$store.state.user = user
    if(user.token){
      //存在用户则进行用户数据的查询
      try{
        await window.$store.dispatch('getUserInfo', {
          token: user.token
        })
      }
      catch (e){
        console.log(e)
      }
    }
  } else {

  }


}

async function insertDefaultUser (code) {
  const defaultUser = {
    uid: 0,
    nickname: '立即登录',
    avatar: '../../icons/browser.ico'
  }
  if (code) {
   // await db.accounts.where('code').equals(code).delete()
  }
  await db.system.where('name').equals('currentUser').modify({ value: defaultUser })
  window.$store.state.user = null
  window.$store.state.user = defaultUser
  return defaultUser
}

window.insertDefaultUser = insertDefaultUser

ipc.on('userLogin', async function (e, data) {
  //此处是用户触发自动登录后的回调地址
  let userResponse =await userMode.getCurrent()
  console.log('userResponse=',userResponse)
  if(userResponse.status===1){
    let data=userResponse.data
    let user={
      uid:data.uid,
      nickname:data.user_info.nickname,
      avatar:data.user_info.avatar,
      token:data.token,
      fans:data.user_info.fans||0,
      postCount:data.user_info.postCount || 0,
      follow:data.user_info.follow||0,
      grade:data.user_info.grade || {
        grade:0
      },
      refreshToken:data.refresh_token,
      expireTime:data.expire_time,
      refreshExpireTime: data.refresh_expire_time,
      code:data.code
    }
    window.$store.commit('set_user',user)
    window.$store.dispatch('getUserInfo')
    //await window.$store.dispatch('getGroups')  //老的团队获取接口
    window.$store.dispatch('getJoinedCircle', {page: 1, row: 500})
    window.$store.dispatch('getMyCircle', {page: 1, row: 500})
  }

})
