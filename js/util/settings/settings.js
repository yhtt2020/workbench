const SettingModel=require('../../../src/model/settingModel')
settingModel=new SettingModel()


var settings = {
  //filePath: window.globalArgs['user-data-path'] + (process.platform === 'win32' ? '\\' : '/') + 'settings.json',
  list: {},
  onChangeCallbacks: [],
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
  set: function (key, value) {
    settings.list[key] = value
    ipc.send('settingChanged', key, value)
    settings.runChangeCallbacks(key)
  },
  async loadFromDb () {
    let dbSettings = await settingModel.getAll(undefined, 'system')

    dbSettings.forEach(set => {
      settings.list[set.key] = JSON.parse(set.value)
    })
  },
  async reload () {
    await settings.loadFromDb()
    settings.runChangeCallbacks()
  },
  initialize: async function () {
    await settings.loadFromDb()

    settings.runChangeCallbacks()

    ipc.on('settingChanged', function (e, key, value) {
      settings.list[key] = value
      settings.runChangeCallbacks(key)
    })

    ipc.on('returnIsDefaultBrowser', function (e, value) {
      //console.log(value)
    })
  }
}
settingModel.initDb().then(async ()=>{
  {
    await settings.initialize()
  }
})

module.exports = settings
