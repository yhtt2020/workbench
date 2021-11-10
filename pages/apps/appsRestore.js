const path = require('path')
const fs = require('fs')
const Database = require('../../js/util/database.js')
window.db = Database.db
window.globalArgs = {}
let loaded = false
process.argv.forEach(function (arg) {
  if (arg.startsWith('--')) {
    var key = arg.split('=')[0].replace('--', '')
    var value = arg.split('=')[1]
    globalArgs[key] = value
  }
})
if (navigator.platform === 'MacIntel') {
  window.platformType = 'mac'
} else if (navigator.platform === 'Win32') {
  window.platformType = 'windows'
} else {
  window.platformType = 'linux'
}

const appsRestore = {
  //存储在appsRestore.json中，与其他的分开存储有一个好处是隔离性，不容易因为其他数据出错而丢失
  savePath: window.globalArgs['user-data-path'] + (platformType === 'windows' ? '\\appsRestore.json' :
    '/appsRestore.json'),
  previousState: null,
  // 保存到数据库
  saveToDB: function (apps) {
    db.myApps.clear().then((rs) => {
      db.myApps.bulkPut(apps).then((rs) => console.log(rs)).catch((err) => {console.log(err)})
    }).catch((err) => console.log(err))
  },
  // 从数据库读取
  restoreFromDB: async function () {
    try {
      //循环处理一下一些没存时间或者没存sort的对象，进行纠错
      var needFilled=[]
       //console.log(await db.myApps.where("addTime").equals(null).toArray())
      await db.myApps.each(async item=>{
        if(typeof item.addTime == 'undefined' ||typeof item.sort=='undefined'){
          let i=item
          if(typeof item.addTime=='undefined')
            i.addTime=Date.now()
          if(typeof item.sort=='undefined')
            i.sort=0
          needFilled.push(i)
          console.log(i)
        }
      })
      await db.myApps.bulkPut(needFilled)
      //await db.myApps.where('addTime').equals(undefined).modify({ 'addTime':Date.now() })
      let s = await db.myApps.orderBy('addTime').reverse().toArray()
      return s
    } catch (e) {
      console.log(e)
      return []
    }
  },
  // 删除单个app
  deleteApp: async function (name) {
    try {
      const s = await db.myApps.where({ name: name }).delete()
    } catch (e) {
      console.log(e)
    }

  },
  // 添加单个app
  addApp: async function (app) {
    try {
      await db.myApps.where({ name: app.name }).delete()
      app.addTime = Date.now()
      app.sort = 0
      await db.myApps.put(app)
    } catch (e) {
      console.log(e)
    }

  },

  save: function (forceSave, sync) {
    //序列化apps成json
    var state = window.appsData.state
    var stateString = JSON.stringify(state)

    var data = {
      version: 2,
      state: JSON.parse(stateString),
      saveTime: Date.now()
    }

    //去重，如果没有变更则不再写入，减少磁盘io
    if (forceSave === true || stateString !== appsRestore.previousState) {
      if (sync === true) {
        fs.writeFileSync(appsRestore.savePath, JSON.stringify(data))
      } else {
        fs.writeFile(appsRestore.savePath, JSON.stringify(data), function (err) {
          if (err) {
            console.warn(err)
          }
        })
      }
      this.previousState = stateString
    }
  },
  restore: function () {
    console.log(appsRestore.savePath)
    var savedStringData
    try {
      savedStringData = fs.readFileSync(appsRestore.savePath, 'utf-8')
    } catch (e) {
      console.warn('failed to read apps restore data', e)
    }
    try {

      if (!savedStringData) {
        //首次运行
        //不需要创建任务，本身系统就会创建任务，这里只需要留空就可以了
        window.loaded = true
        window.appsData = false
        return
      }

      var data = JSON.parse(savedStringData) //转化为存储数据

      // 数据无法恢复
      if ((data.version && data.version !== 2) || (data.state && data.state.apps && data.state.apps.length === 0)) {
        window.loaded = true //设置为已经读入了左侧栏
        window.appsData = false
        return
      }
      //尝试读取一次getAll，这个会创建一个默认的数组
      window.appsData = data
      window.loaded = true //设置为已经读入了左侧栏
    } catch (e) {
      // an error occured while restoring the session data

      console.error('restoring apps failed: ', e)

      var backupSavePath = require('path').join(window.globalArgs['user-data-path'],
        'appsRestoreBackup-' + Date.now() + '.json')

      fs.writeFileSync(backupSavePath, savedStringData)

      window.appsData = false
      window.loaded = true //设置为已经读入了左侧栏
    }

  },
  initialize: function () {
    //每隔30s存储一次

    // setInterval(appsRestore.save, 5000)
    appsRestore.restoreFromDB()
    window.onbeforeunload = function (e) {
      //appsRestore.save(true, true)
    }
    //appsRestore.restore()
  }
}
module.exports = appsRestore

