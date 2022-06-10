var settings = {
  loaded: false,
  list: {},
  onLoadCallbacks: [],
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
  get: function (key, cb) {
    // get the setting from the cache if possible
    if (settings.loaded) {
      cb(settings.list[key])

    // if the settings haven't loaded, wait until they have
    } else {
      settings.onLoadCallbacks.push({
        key: key,
        cb: cb
      })
    }
  },
  listen: function (key, cb) {
    if (key && cb) {
      settings.get(key, cb)
      settings.onChangeCallbacks.push({ key, cb })
    } else if (key) {
      // global listener
      settings.onChangeCallbacks.push({ cb: key })
    }
  },
  set: function (key, value) {
    settings.list[key] = value
    postMessage({ message: 'setSetting', key, value })
    settings.runChangeCallbacks(key)
  },
  load: function () {
    postMessage({ message: 'getSettingsData' })
  },
  onLoad: function (cb) {
    if (settings.loaded) {
      cb()
    } else {
      settings.onLoadCallbacks.push({
        key: '',
        cb: cb
      })
    }
  }
}

window.addEventListener('message', function (e) {
  if (e.data.message && e.data.message === 'receiveSettingsData') {
    settings.list = e.data.settings

    if (!settings.loaded) {
      settings.onLoadCallbacks.forEach(function (item) {
        item.cb(settings.list[item.key])
      })
      settings.onLoadCallbacks = []
    }

    settings.loaded = true
    settings.runChangeCallbacks()


  }

  //接收到返回是否是默认浏览器的消息，根据情况直接设置内容
  if(e.data.message && e.data.message === 'returnIsDefaultBrowser'){
	var defaultBrowserButton = document.getElementById('button-default-browser')
	if(e.data.result==false){
		defaultBrowserButton.innerText=l('notDefaultBrowser')
	}else{
		defaultBrowserButton.innerText=l('isDefaultBrowser')
	}
  }


})

settings.load()
module.exports = settings
