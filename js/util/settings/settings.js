if(typeof fs ==='undefined'){
  var fs=require('fs')
}
var settings = {
  filePath: window.globalArgs['user-data-path'] + (process.platform === 'win32' ? '\\' : '/') + 'settings.json',
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
  initialize: function () {
    var fileData
    try {
      fileData = fs.readFileSync(settings.filePath, 'utf-8')
    } catch (e) {
      if (e.code !== 'ENOENT') {
        console.warn(e)
      }
    }
    console.log(fileData)
    if (fileData) {
      settings.list = JSON.parse(fileData)
    }

    settings.runChangeCallbacks()

    ipc.on('settingChanged', function (e, key, value) {
      settings.list[key] = value
      settings.runChangeCallbacks(key)
    })

	ipc.on('returnIsDefaultBrowser',function(e,value){
		console.log(value)
	})
  }
}

settings.initialize()
module.exports = settings
