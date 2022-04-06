const browserUI = require('browserUI.js')
const tabEditor = require('navbar/tabEditor.js')
const tabState = require('tabState.js')
const localAdapter=require('../src/util/sessionAdapter/localAdapter')
const cloudAdapter=require('../src/util/sessionAdapter/cloudAdapter')
const spaceModel=require('../src/model/spaceModel')
const ipc= require('electron').ipcRenderer
const SYNC_INTERVAL=5
const sessionRestore = {
  adapter:{},
  currentSpace:{},
  save:async function (forceSave=true, sync=true) {
    var stateString = JSON.stringify(tasks.getStringifyableState())
    var data = {
      version: 2,
      state: JSON.parse(stateString),
      saveTime: Date.now()
    }
    let countTask=data.state.tasks.length
    let countTab=0
    data.state.tasks.forEach(task=>{
      countTab+=task.tabs.length
    })


    // save all tabs that aren't private

    for (var i = 0; i < data.state.tasks.length; i++) {
      data.state.tasks[i].tabs = data.state.tasks[i].tabs.filter(function (tab) {
        return !tab.private
      })
    }
    let saveData={
      count_task:countTask,
      count_tab:countTab,
      data:data,
    }

    if (forceSave === true || stateString !== sessionRestore.previousState) {
      let uid = typeof sessionRestore.currentSpace.userInfo==='undefined'?0 :sessionRestore.currentSpace.userInfo.uid
      let space={
        id:sessionRestore.currentSpace.spaceId,
        name:sessionRestore.currentSpace.name,
        uid:uid,
        type:sessionRestore.currentSpace.spaceType
      }
      localAdapter.save(space, saveData)
      if (sync === true) {
        //本地存储是必须存的，并且还要夹带type
       saveData.type=sessionRestore.currentSpace.spaceType
       if(sessionRestore.currentSpace.spaceType==='cloud'){
         //如果是云端空间，还需要将此用户的信息存储下来，避免后面切换空间后导致当前用户信息丢失之后，无法再通过接口交互。
         saveData.userInfo=sessionRestore.userInfo
       }
       sessionRestore.adapter.save(sessionRestore.currentSpace.spaceId, saveData)
        console.log(saveData)
        console.log('成功存入到本地space空间')
        // fs.writeFileSync(sessionRestore.savePath, JSON.stringify(data))
      }
      //如果是云端，还需去云端同步
      try{
        if(sessionRestore.currentSpace.spaceType==='cloud'){
         let cloudResult=await sessionRestore.adapter.save(sessionRestore.currentSpace.spaceId, saveData)
          if(cloudResult.status===1){
            ipc.send('saving')
            console.log('顺利保存至云端')
          }else{
            console.warn('未能顺利保存至云端，但仍然可控，失败原因如下：')
            //todo 如果走到这里，其实意味着这个备份空间已经无法恢复了，需要走备份损坏（冲突模式）模式。
            console.log(cloudResult.data)
          }
        }
      }catch (e) {
        //todo 走备份空间流程
      }


        // fs.writeFile(sessionRestore.savePath, JSON.stringify(data), function (err) {
        //   if (err) {
        //     console.warn(err)
        //   }
        // })

      sessionRestore.previousState = stateString
    }
  },
   restore:async function () {
     var savedStringData=''
    try{
      savedStringData=  await sessionRestore.adapter.restore(sessionRestore.currentSpace.spaceId)
    }catch (e) {
      console.log('获取存储的空间信息失败')
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

      if (tasks.getSelected().tabs.isEmpty() || (!data.saveTime || Date.now() - data.saveTime < SYNC_INTERVAL*1000)) {
        //如果当前选中的任务为空，或（没保存或者保存间隔小于30秒）
        browserUI.switchToTask(data.state.selectedTask)
        if (tasks.getSelected().tabs.isEmpty()) {
          tabEditor.show(tasks.getSelected().tabs.getSelected())
        }
      } else {
        //window.createdNewTaskOnStartup = true
        // try to reuse a previous empty task
        var lastTask = tasks.byIndex(tasks.getLength() - 1)
        if(lastTask){
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
  initialize:async function () {
    let currentSpace={}
    try{
     currentSpace= await spaceModel.getCurrent()
      let space=await spaceModel.getSpace(currentSpace.spaceId)
      if(currentSpace.spaceType==='cloud'){
        if(space.userInfo){
          try{
            let result=await spaceModel.setUser(space.userInfo).clientOnline(space.id,false)
            if(result.status===1){
              if(result.data==='-1'){
                ipc.send('showUserWindow',{spaceId:currentSpace.spaceId,modal:true,title:'无法读入云端空间',description:'云端空间已被删除，无法读入。',fatal:true})
              }
              if(result.data==='-2'){
                ipc.send('showUserWindow',{spaceId:currentSpace.spaceId,modal:true,title:'无法成功上线设备',description:'云端空间已被其他设备抢占，导致无法成功取得空间使用权。',fatal:true})
              }
              else{
                //正常登录
              }
            }
          }catch (e) {
            console.warn(e)
            ipc.send('showUserWindow',{spaceId:currentSpace.spaceId,modal:true,title:'无法取得云端空间信息',description:'由于意外情况导致无法连接远端空间。',disconnect:true})
          }
        }else{
          ipc.send('showUserWindow',{spaceId:currentSpace.spaceId,modal:true,title:'备份空间用户凭证失效',description:'备份空间的用户凭证失效，无法保存至云端。',fatal:true})
        }

      }
    }catch (e) {
      //let lastSpace=await spaceModel.setAdapter('local').getLastSyncSpace()

      ipc.send('showUserWindow',{spaceId:currentSpace.spaceId,modal:true,title:'意外原因无法读取云端空间',description:'由于意外情况导致无法连接远端空间。',disconnect:true})

      // if(lastSpace===null){
      //   ipc.send('closeMainWindow')
      //   ipc.send('showUserWindow',{tip:'网络原因无法读取云端空间，请选择其他空间登录。',modal:true})
      //
      //   return
      // }
      //
      // console.log(lastSpace)
      // await spaceModel.setAdapter('local').changeCurrent({id:lastSpace.id})
      // ipc.send('showUserWindow',{tip:'网络原因无法读取云端空间，请选择其他空间登录。',modal:true})
      // console.error(e)
      // console.log('获取当前空间失败',e)
      //return
    }

    sessionRestore.currentSpace=currentSpace
    if(currentSpace.spaceType==='local'){
      sessionRestore.adapter=localAdapter
    }else{
      sessionRestore.adapter=cloudAdapter
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

    setInterval(sessionRestore.save, SYNC_INTERVAL*1000)

    window.onbeforeunload = function (e) {
      sessionRestore.save(true, true)
      if(sessionRestore.currentSpace.spaceType==='cloud'){
        spaceModel.setUser(sessionRestore.currentSpace.userInfo).clientOffline()
      }
    }
  }
}

module.exports = sessionRestore
