require('../../dist/localization.build.js')

const electron = require('electron')
const ipc = electron.ipcRenderer
const { db } = require('../../js/util/database.js')
let mainWindowId = 0
window.l = l
window.db= db
const {
  contextBridge
} = require('electron')
//将语言包的接口暴露给里面的页面
window.l = l
window.ipc = ipc
// contextBridge.exposeInMainWorld('l', l)
// contextBridge.exposeInMainWorld('ipc', ipc)

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
    case 'resortTasks':
      ipc.sendTo(mainWindowId, 'resortTasks', {
        'droppedTaskId': e.data.droppedTaskId,
        'adjacentTaskId': e.data.adjacentTaskId
      })
      break
    case 'setting':
      ipc.send('openSetting')
      break
    case 'home':
      ipc.send('openHome')
      break
    case 'help':
      ipc.send('openHelp')
      break
    case 'mobile':
      ipc.send('openMobile')
      break;
    case 'addTab':
      ipc.send('addTab', { 'url': e.data.url })
      break;
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

//读入当前登陆的账号
function getCurrentUser () {
  db.system.get({ 'name': 'currentUser' }).then((item) => {
      let user = {}
      if (typeof (item) == 'undefined') {
        //如果还没有当前用户，则插入一个默认用户
        user = insertDefaultUser()
      } else {
        user = item.value
        window.$store.state.user = user
      }
      console.log('获取当前用户成功')
      console.log(user)
    }
  ).catch((err) => {
    console.log('获取当前用户失败')
    console.log(err)
  })

  // db.system.put({//当前用户
  // 		name:'currentUser',
  // 		value:{
  // 			uid:0,
  // 			nickname:"立即登录",
  // 			avatar:"../../icons/browser.ico"
  // 		}
  // 	}).catch((err)=>{
  // 		console.log(err)
  // }).then((res)=>{
  // 	console.log(res)
  // })
  //if(currentUser)
}

function insertDefaultUser () {
  const defaultUser = {
    uid: 0,
    nickname: '立即登录',
    avatar: '../../icons/browser.ico'
  }
  db.system.where({name:'currentUser'}).delete()
  db.system.put({//当前用户
    name: 'currentUser',
    value: defaultUser
  }).catch((err) => {
    console.log(err)
  }).then((res) => {
    console.log('insertDefaultUser failed')
  })
  window.$store.state.user=null
  window.$store.state.user = defaultUser
  return defaultUser
}
window.insertDefaultUser=insertDefaultUser
setTimeout(getCurrentUser, 1000)
ipc.on('userLogin', function (e, data) {
  console.log('userinfo')
  let userInfo = JSON.parse(data.userInfo)
  console.log(userInfo)
  let user = {
    uid: userInfo.uid,
    nickname: userInfo.nickname,
    avatar: userInfo.avatar
  }

  window.$store.state.user = user
  // 设置当前登陆账号为此账号
  db.system.where({name:'currentUser'}).delete()
  db.system.put({
    name:'currentUser',
    value: user
  }).then((msg) => {
    console.log(msg)
    db.accounts.put({
      uid: user.uid,
      nickname: user.nickname,
      avatar: user.avatar,
      lastLoginTime: new Date().getTime()
    })
  }).catch((err) => {
    console.log('登录后设置当前用户失败')
    console.log(err)
  })
  // ++id,uid,nickname,avatar,lastLoginTime,token,isCurrent,lastUseSpace
  //插入一个用户账号到账号表

})
