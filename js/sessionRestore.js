const browserUI = require('browserUI.js')
const tabEditor = require('navbar/tabEditor.js')
const tabState = require('tabState.js')
const localAdapter = require('../src/util/sessionAdapter/localAdapter')
const cloudAdapter = require('../src/util/sessionAdapter/cloudAdapter')
const spaceModel = require('../src/model/spaceModel')
const localSpaceModel = require('../src/model/localSpaceModel')
const backupSpaceModel = require('../src/model/backupSpaceModel')
const urlParser = require('../js/util/urlParser')
const ipc = require('electron').ipcRenderer
let SYNC_INTERVAL = 30 //普通模式下，同步间隔为30秒
let safeClose=false
if ('development-mode' in window.globalArgs) {
  SYNC_INTERVAL = 5 //开发模式下，间隔改为5，方便调试和暴露问题
}
let autoSaver = null
/**
 * 致命中断
 * @param options
 */
function fatalStop (options) {
  ipc.send('showUserWindow', options)
  sessionRestore.stopAutoSave()//如果是致命问题，则不再自动保存了，否则还是容易出错。
}

/**
 * 设为离线
 * @param options
 */
function disconnect (options) {
  if (!backupSpaceModel.getOfflineUse(options.spaceId)) {
    //如果不是离线使用中
    ipc.send('showUserWindow', options)
    ipc.send('disconnect')
  } else {
  }
}

/**
 * 自动计算，并返回存储用的格式
 * @param data
 * @returns {{count_tab: number, data, name, count_task, type: (string|*)}}
 */
function getSaveData (data) {
  let countTask = data.state.tasks.length
  let countTab = 0
  data.state.tasks.forEach(task => {
    countTab += task.tabs.length
    task.tabs.forEach(tab => {
      tab.url = urlParser.getSourceURL(tab.url)
    })
  })
  return {
    count_task: countTask,
    count_tab: countTab,
    data: data,
    name: sessionRestore.currentSpace.name,
    type: sessionRestore.spaceType
  }
}

const sessionRestore = {
  adapter: {},
  currentSpace: {},
  save: async function (forceSave = true, sync = true) {
    var stateString = JSON.stringify(tasks.getStringifyableState())
    // save all tabs that aren't private
    var data = {
      version: 2,
      state: JSON.parse(stateString),
      saveTime: Date.now()
    }
    for (var i = 0; i < data.state.tasks.length; i++) {
      data.state.tasks[i].tabs = data.state.tasks[i].tabs.filter(function (tab) {
        return !tab.private
      })
    }
    let saveData = getSaveData(data)

    if (forceSave === true || stateString !== sessionRestore.previousState) {
      let uid = typeof sessionRestore.currentSpace.userInfo === 'undefined' ? 0 : sessionRestore.currentSpace.userInfo.uid
      let space = {
        id: sessionRestore.currentSpace.spaceId,
        name: sessionRestore.currentSpace.name,
        uid: uid,
        type: sessionRestore.currentSpace.spaceType
      }
      if (sync === true) {
        //本地存储逻辑，这个是必须存储的，哪怕是云端也要存一个备份空间
        saveData.type = sessionRestore.currentSpace.spaceType
        if (sessionRestore.currentSpace.spaceType === 'cloud') {
          saveData.userInfo = sessionRestore.currentSpace.userInfo
          //备份空间需要额外夹带一个最新的用户信息
          //如果是云端空间，还需要将此用户的信息存储下来，避免后面切换空间后导致当前用户信息丢失之后，无法再通过接口交互。
          console.log('离线保存成功', space, saveData)
          backupSpaceModel.save(space, saveData)
        } else {
          console.log('本地空间保存成功', space, saveData)
          localSpaceModel.save(space, saveData)
        }
      }
      //如果是云端，还需去云端同步
      try {
        if (sessionRestore.currentSpace.spaceType === 'cloud') {
          let cloudResult = await sessionRestore.adapter.save(sessionRestore.currentSpace.spaceId, saveData)
          if (cloudResult.status === 1) {
            ipc.send('saving')
          } else {
            if (cloudResult.data.action === 'fatal') {
              fatalStop(cloudResult.data.option)
              console.warn('保存至云端失败，产生致命错误：')
              //todo 如果走到这里，其实意味着这个备份空间已经无法恢复了，需要走备份损坏（冲突模式）模式。
            } else if (cloudResult.data.action === 'disconnect') {
              console.warn('保存至云端失败，但无需紧张')
              disconnect(cloudResult.data.option)
            } else {
              console.warn('保存至云端失败，但是无需做任何反馈')
            }

          }
        }
      } catch (e) {
        //todo 走备份空间流程
      }
      sessionRestore.previousState = stateString //存储上一次的样本
    }
  },
  restore: async function () {
    var savedStringData = ''
    try {
      savedStringData = await sessionRestore.adapter.restore(sessionRestore.currentSpace.spaceId)
      if (!savedStringData && sessionRestore.currentSpace.spaceType === 'cloud') {
        //当云端空间无法正常读入的时候，尝试从备份空间获取
        try {
          let backupSpace = await backupSpaceModel.getSpace(sessionRestore.currentSpace.spaceId)
          if (backupSpace) {
            savedStringData = JSON.stringify(backupSpace.data)
            setTimeout(() => {
              ipc.send('message', { type: 'info', config: { content: '无法连接至云端，当前工作在离线模式下。连接恢复后会自动转入在线模式。' } })
            }, 3000)
          } else {
            console.warn('从本地获取的时候，本地备份不存在')
          }
        } catch (e) {
          savedStringData = false
          console.warn('当远端无法获取，尝试从本地备份空间恢复时意外报错')
          console.warn(e)
        }
      }
    } catch (e) {
      console.warn(e)
      console.warn('获取存储的空间信息失败')
    }

    try {
      // first run, show the tour
      //首次运行，显示官方网站
      if (!savedStringData) {
        tasks.setSelected(tasks.add()) // create a new task

        var newTab = tasks.getSelected().tabs.add({
          url: 'https://apps.vip'
        })
        browserUI.addTab(newTab, {
          enterEditMode: false
        })
        return
      }

      var data = JSON.parse(savedStringData)

      // the data isn't restorable
      if ((data.version && data.version !== 2) || (data.state && data.state.tasks && data.state.tasks.length === 0)) {
        tasks.setSelected(tasks.add())
        browserUI.addTab(tasks.getSelected().tabs.add())
        return
      }

      // add the saved tasks

      data.state.tasks.forEach(function (task) {
        // restore the task item
        task.tabs.forEach(tab => {
          tab.url = urlParser.parse(tab.url)
        })
        tasks.add(task)

        /*
        If the task contained only private tabs, none of the tabs will be contained in the session restore data, but tasks must always have at least 1 tab, so create a new empty tab if the task doesn't have any.
        */
        if (task.tabs.length === 0) {
          tasks.get(task.id).tabs.add()
        }
      })
      tasks.setSelected(data.state.selectedTask)

      // switch to the previously selected tasks

      if (tasks.getSelected().tabs.isEmpty() || (!data.saveTime || Date.now() - data.saveTime < SYNC_INTERVAL * 1000)) {
        //如果当前选中的任务为空，或（没保存或者保存间隔小于30秒）
        browserUI.switchToTask(data.state.selectedTask)
        if (tasks.getSelected().tabs.isEmpty()) {
          tabEditor.show(tasks.getSelected().tabs.getSelected())
        }
      } else {
        //window.createdNewTaskOnStartup = true
        // try to reuse a previous empty task
        var lastTask = tasks.byIndex(tasks.getLength() - 1)
        if (lastTask) {
          browserUI.switchToTask(lastTask.id)
        }

        //启动创建新任务行为取消，改为选中最后一个任务
        // if (lastTask && lastTask.tabs.isEmpty() && !lastTask.name) {
        //  //如果存在最后一个任务，且此任务为空，且此任务未命名
        //   browserUI.switchToTask(lastTask.id)
        //   tabEditor.show(lastTask.tabs.getSelected())
        // } else {
        //基本判定是此任务不为空
        //   console.log('failed')
        //   console.log('lasttask=↓')
        //   console.log(lastTask)
        //   browserUI.addTask()
        // }
      }

      /* Disabled - show user survey
      // if this isn't the first run, and the survey popup hasn't been shown yet, show it
      if (shouldShowSurvey) {
        fetch('https://minbrowser.org/survey/survey15.json').then(function (response) {
          return response.json()
        }).then(function (data) {
          setTimeout(function () {
            if (data.available && data.url) {
              if (tasks.getSelected().tabs.isEmpty()) {
                webviews.update(tasks.getSelected().tabs.getSelected(), data.url)
                tabEditor.hide()
              } else {
                var surveyTab = tasks.getSelected().tabs.add({
                  url: data.url
                })
                browserUI.addTab(surveyTab, {
                  enterEditMode: false
                })
              }
            }
          }, 200)
        })
      }
      */
    } catch (e) {
      //基本上走不到这里。

      // an error occured while restoring the session data
      console.error('还原空间数据失败: ', e)
      //console.error('restoring session failed: ', e)

      var backupSavePath = require('path').join(window.globalArgs['user-data-path'], 'sessionRestoreBackup-' + Date.now() + '.json')

      fs.writeFileSync(backupSavePath, savedStringData)

      // destroy any tabs that were created during the restore attempt
      tabState.initialize()

      // create a new tab with an explanation of what happened
      var newTask = tasks.add()
      var newSessionErrorTab = tasks.get(newTask).tabs.add({
        url: 'file://' + __dirname + '/pages/sessionRestoreError/index.html?backupLoc=' + encodeURIComponent(backupSavePath)
      })

      browserUI.switchToTask(newTask)
      browserUI.switchToTab(newSessionErrorTab)
    }
  },
  init () {
    //如果是则判断是否是老浏览器，如果是则从老空间恢复，否则直接插入一个新空间。
    ldb.reload()
    let currentSpace = ldb.db.get('currentSpace').value()
    console.log(currentSpace)
    if (typeof currentSpace.spaceId === 'undefined') {
      console.warn('检测到是首次运行')
      //不存在当前空间，则认为是新的
      let loadedData = localAdapter.loadOldRestore()
      if (loadedData) {
        console.warn('读入老的数据')
        //如果存在老的数据
        spaceModel.insertFirstSpace(JSON.parse(loadedData))
      } else {
        console.warn('初始全新')
        spaceModel.insertFirstSpace()
        //确定是全新用户
      }
    }
  },
  initialize: async function () {
    //检查是否是第一次运行，如果是，则进行初始化
    sessionRestore.init()
    let currentSpace = {}
    currentSpace = await spaceModel.getCurrent()
    let space = {}
    if (currentSpace.spaceType === 'cloud') {
      let backupSpace = await backupSpaceModel.getSpace(currentSpace.spaceId) //获取本地的备份空间

      try {
        let spaceResult = await spaceModel.setUser(currentSpace.userInfo).getSpace(currentSpace.spaceId) //先尝试获取一次最新的空间
        if (spaceResult.status === 1) {
          if (String(spaceResult.data.id) === '-1') {
            fatalStop({
              spaceId: currentSpace.spaceId,
              modal: true,
              title: '无法读入云端空间',
              description: '云端空间已被删除，无法读入。',
              fatal: true
            })
            return
          }
          if (String(spaceResult.data.id) === '-2') {
            fatalStop({
              spaceId: currentSpace.spaceId,
              modal: true,
              title: '无法读入云端空间',
              description: '云端空间已被其他设备抢占，导致无法成功取得空间使用权。',
              fatal: true
            })
            return
          } else {
            //正常登录
            space = spaceResult.data
            space.id = space.nanoid

            console.log('backupSpace=', backupSpace)
            if (!!!backupSpace) {
              //如果backupSpace还不存在，则需要将成功获取的网络当做备份空间
              //注意，如果是切换过来的空间，因为在切换之前就会读入一次最新的作为备份空间，反倒不会走这个步骤
              console.log('发现本地的备份空间还不存在，自动将远端保存为备份空间')
              space.userInfo = currentSpace.userInfo
              backupSpaceModel.save(space, space)
              backupSpace = space
            }
            if (space['client_id'] === currentSpace.userInfo.clientId) {
              //todo 如果当前是备份空间，且还有未同步到云端的变更，则需要判断上次断开的时候是不是当前的备份空间
              try {
                //如果发现是断线重连，需要将本地的存储到线上
                console.log('发现是断线重连场景')
                console.log(backupSpace)
                console.log(backupSpace.data)
                let cloudResult = await cloudAdapter.save(currentSpace.spaceId, getSaveData(backupSpace.data))
                console.log('恢复返回', cloudResult)
                if (cloudResult.status === 1) {
                  setTimeout(() => {
                    ipc.send('reconnect')
                  }, 2000)
                  console.log('将离线空间保存到云端成功。')
                } else {
                  if (cloudResult.data.action === 'fatal') {
                    fatalStop(cloudResult.data.option)
                    console.warn('离线空间保存至云端失败，产生致命错误：')
                    //todo 如果走到这里，其实意味着这个备份空间已经无法恢复了，需要走备份损坏（冲突模式）模式。
                  } else if (cloudResult.data.action === 'disconnect') {
                    console.warn('保存至云端失败，但无需紧张')
                    disconnect(cloudResult.data.option)
                  } else {
                    console.warn('保存至云端失败，但是无需做任何反馈')
                  }
                }
                console.log('发现当前是离线重新上线成功')
                spaceModel.setCurrentSpace(backupSpace)
              } catch (e) {
                console.warn('恢复离线备份空间到云端失败')
                console.warn(e)
              }
            } else {
              //正常登录需要使用线上版本的空间来更新一下本地的备份空间，此时是最佳的更新备份空间时机
              backupSpaceModel.save(space, {
                data: space.data,
                count_task: space.count_task,
                count_tab: space.count_tab,
                userInfo: currentSpace.userInfo
              })
              spaceModel.setCurrentSpace(space)
            }
          }
        }
        //接着云端初始逻辑
        if (!!backupSpace) {
          if (!backupSpace.userInfo) {
            //如果这个空间信息不存在用户的信息，主要是一些老的空间，可能还没存用户信息
            let uid = typeof currentSpace.userInfo === 'undefined' ? 0 : currentSpace.userInfo.uid
            let backupSpace = {
              id: currentSpace.spaceId,
              name: currentSpace.name,
              uid: uid,
              type: currentSpace.spaceType,
              userInfo: currentSpace.userInfo
            }
            if (!!!backupSpace.userInfo) {
              //如果读入了当前用户信息还是不存在，则证明当前用户已经没有登录信息了
              fatalStop({
                spaceId: currentSpace.spaceId,
                modal: true,
                title: '备份空间用户凭证失效',
                description: '备份空间的用户凭证失效，无法保存至云端。请重新登录后恢复备份。',
                fatal: true,
                canSaveToCloud: false
              })
            } else {
              localAdapter.update(backupSpace) //此处是容错部分，主要用于兼容以前没有存下userInfo的，立马存一个userInfo进去。
            }
          }
          space.userInfo = backupSpace.userInfo
          //新的备份空间都已经具备了用户信息字段了
        }

        //如果是云端空间，尝试上线设备
        //设备上线 ↓
        try {
          let result = await spaceModel.setUser(space.userInfo).clientOnline(space.id, false)
          if (result.status === 1) {
            if (result.data.toString() === '-1') {
              fatalStop({
                spaceId: currentSpace.spaceId,
                modal: true,
                title: '无法成功上线设备',
                description: '云端空间已被删除，无法读入。',
                fatal: true
              })
            }
            if (result.data.toString() === '-2') {
              fatalStop({
                spaceId: currentSpace.spaceId,
                modal: true,
                title: '无法成功上线设备',
                description: '云端空间已被其他设备抢占，导致无法成功取得空间使用权。',
                fatal: true
              })
            } else {
              //正常登录
            }
          }
        } catch (e) {
          console.warn(e)
          disconnect({
            spaceId: currentSpace.spaceId,
            modal: true,
            title: '无法取得云端空间信息',
            description: '由于意外情况导致无法连接远端空间。',
            disconnect: true
          })
        }
      } catch (e) {
        console.warn(e)
        disconnect({
          spaceId: currentSpace.spaceId,
          modal: true,
          title: '无法取得云端空间信息',
          description: '由于意外情况导致无法连接远端空间。',
          disconnect: true
        })
        setTimeout(() => {
          ipc.send('disconnect')
        }, 2000)
      }
    } else {
      //此处为本地空间的初始化逻辑
      space = await localSpaceModel.getSpace(currentSpace.spaceId) //先尝试获取一次最新的空间
      //如果还不存在备份空间，应该是老版本，从未保存本地备份，这种场景可以不处理，下次自动保存一次就好了
      space.userInfo = currentSpace.userInfo
    }

    sessionRestore.currentSpace = currentSpace
    if (currentSpace.spaceType === 'local'
    ) {
      sessionRestore.adapter = localAdapter
    } else {
      sessionRestore.adapter = cloudAdapter
    }
//todo 获取当前的用户，判断如果未登录，则尝试从本地寻找适配器读入空间。
    /*
    id: 20
    name: "currentUser"
    value:
    avatar: "https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/base64_upload_536121645792907?upload_type/Tencent_COS"
    code: "13ca7dd95be7caaa8d3b8597d6b6329b"
    expire_deadtime: 1648716570936
    fans: 0
    follow: 0
    grade: {grade: 0}
    nickname: "想天浏览器"
    postCount: 0
    refreshExpire_deadtime: 1650617370936
    refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc1JlZnJlc2giOnRydWUsImNvZGUiOiIxM2NhN2RkOTViZTdjYWFhOGQzYjg1OTdkNmI2MzI5YiIsInVpZCI6NCwiaWF0IjoxNjQ4MTExNzcwLCJleHAiOjE2NTA2MTczNzB9.W5oAT7ESdpOawXdqVDWti8SzBowYmqxrMxyCv2BhHIs"
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc1JlZnJlc2giOmZhbHNlLCJjb2RlIjoiMTNjYTdkZDk1YmU3Y2FhYThkM2I4NTk3ZDZiNjMyOWIiLCJ1aWQiOjQsImlhdCI6MTY0ODExMTc3MCwiZXhwIjoxNjQ4NzE2NTcwfQ.oWjgNkRD6eaw3dFxJidL2fMlwVI1jlK-g_-WQ87AdJI"
    uid: 4



    id: 20
    name: "currentUser"
    value:
    avatar: "../../icons/browser.ico"
    nickname: "立即登录"
    uid: 0
     */

    sessionRestore.startAutoSave()
    window.onbeforeunload = function (e) {
      //这里只是用于意外关闭的情况，由于unload事件无法保证全部执行完毕，所以这个方法不被依赖，仅用于意外情况下的补救。正常的关闭走ipc的safeClose消息或者主进程对应的safeCloseMainWindow()
      if(safeClose===false){
        sessionRestore.stopAutoSave()
        sessionRestore.save(true, true).then(()=>{
          if (sessionRestore.currentSpace.spaceType === 'cloud') {
            spaceModel.setUser(sessionRestore.currentSpace.userInfo).clientOffline()
          }
        })
      }
    }
  }
  ,
  startAutoSave: () => {
    autoSaver = setInterval(sessionRestore.save, SYNC_INTERVAL * 1000)
  },
  stopAutoSave: () => {
    clearInterval(autoSaver)
  }
}
async function safeCloseSave() {
  //这里的关闭特意做成同步方法，避免顺序错误导致无法保存
  sessionRestore.stopAutoSave()
  await sessionRestore.save(false, true)
  if (sessionRestore.currentSpace.spaceType === 'cloud') {
    await spaceModel.setUser(sessionRestore.currentSpace.userInfo).clientOffline()
  }
  safeClose=true
}
ipc.on('safeClose', async () => {
  //安全关闭，先完成保存后再关闭
  await safeCloseSave()
  ipc.send('closeMainWindow')
})

ipc.on('safeQuitApp',async ()=>{
  await  safeCloseSave()
  ipc.send('quitApp')
})
module.exports = sessionRestore
