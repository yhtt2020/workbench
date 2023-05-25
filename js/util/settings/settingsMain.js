const SettingModel = require('../../../src/model/settingModel')
settingModel = new SettingModel()

var settings = {
  init: false,
  //filePath: userDataPath + (process.platform === 'win32' ? '\\' : '/') + 'settings.json',
  fileWritePromise: null,
  list: {},
  onChangeCallbacks: [],
  saveToDb: async function () {
    for (const key of Object.keys(settings.list)) {
      await settingModel.set(undefined, 'system', key, settings.list[key])
    }
  },
  setDb: async function (key,value) {
    await settingModel.set(undefined, 'system', key,value)
  },
  runChangeCallbacks (key) {
    settings.onChangeCallbacks.forEach(function (listener) {
      if (!key || !listener.key || listener.key === key) {
        if (listener.key) {
          listener.cb(settings.list[listener.key])
        } else {
          listener.cb(key)
        }
      }
    })
  },
  get: function (key) {
    return settings.list[key]
  },
  listen: function (key, cb) {
    if (key && cb) {
      cb(settings.get(key))
      settings.onChangeCallbacks.push({ key, cb })
    } else if (key) {
      // global listener
      settings.onChangeCallbacks.push({ cb: key })
    }
  },
  async loadFromDb () {
    let dbSettings = await settingModel.getAll(undefined, 'system')

    dbSettings.forEach(set => {
      settings.list[set.key] = JSON.parse(set.value)
    })
  },
  set (key, value) {
    settings.list[key] = value
    settings.setDb(key,value).then(() => {
      settings.runChangeCallbacks(key)

      if (mainWindow) {
        mainWindow.webContents.send('settingChanged', key, value)
      }
    })

  },
  initialize: async function () {
    await settings.loadFromDb()

    if (!global.settingsSetted) {
      //只绑定一次，防止多次绑定产生并发
      require('electron').ipcMain.on('settingChanged', function (e, key, value) {
        settings.list[key] = value
        settings.saveToDb()
        if (mainWindow && !mainWindow.isDestroyed()) {
          if (e.sender.id !== mainWindow.webContents.id) {
            //此处必须对非主界面发来的消息做变更提醒，不然浏览器主界面不会感知到，也就不会同步更新其他页面了。
            if (mainWindow && !mainWindow.isDestroyed()) { mainWindow.webContents.send('settingChanged', key, value) }
          } else {
            //console.log('主进程自己修改，不需要通知')
          }

          settings.runChangeCallbacks(key)
        }
      })
    }
    global.settingsSetted = true
  },
  initSetting (cb) {
    settingModel.initDb().then(async () => {
      {
        if (!global.settings.init) {
          global.settings = settings
          settings.initialize().then(async () => {
            if (cb) await cb()
          })
        }
      }
    })
  }
}

module.exports = settings
