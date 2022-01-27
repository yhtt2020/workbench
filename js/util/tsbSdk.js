const tsbSdk = {
  saApp: {},
  isThirdApp: Boolean,
  //初始化监听
  listener: function() {
    try {
      ipc.send('getSaApp')
      ipc.on('callback-getSaApp', (event, args) => {
        tsbSdk.saApp = args.saApp
        console.log(tsbSdk.saApp, '@拿到了saApp')
      })
      Object.defineProperty(tsbSdk, 'isThirdApp', {
        writable: false,
        value: false
      })
    } catch(err) {
      Object.defineProperty(tsbSdk, 'isThirdApp', {
        writable: false,
        value: true
      })
    }
    window.addEventListener('message', function(e) {
      let messageEvent = e.data.eventName
      switch(messageEvent) {
        case 'checkAuth':
          tsbSdk.handleCheckAuth(e.data)
          break
        case 'hideApp':
          tsbSdk.handleHideApp()
          break
        case 'tabLinkJump':
          tsbSdk.newTabNavigate(e.data)
          break
        case 'destoryApp':
          tsbSdk.handleDestoryApp()
          break
        case 'preloadAuthResult':
          //todo后面根据preload的真正返回data返回
          window.postMessage({
            eventName: 'authResult',
            signature: 'ts',
            sdkSwitch: true
          })
      }
    })
    console.log('挂载了SDK')
  },

  handleCheckAuth: function(data) {
    //const { appId, timestamp, nonceStr, signature, jsApiList } = data.secretInfo
    //解密signature，sha1方法
    //校验解密出来的timestamp、nonceStr是否一致
    //然后再进一步远程ts服务器校验(jsapi_ticket, origin)是否过期，不过期返回一个true，过期返回false
    //const axios = require('axios')
    // axios.post().then(res => {
    //   if(res.code === 200) {
    //     window.postMessage({
    //       eventName: 'authResult',
    //       signature: signature,
    //       sdkSwitch: true
    //     })
    //   } else {
    //     window.postMessage({
    //       eventName: 'authResult',
    //       signature: signature,
    //       sdkSwitch: false
    //     })
    //   }
    // }).catch(err => {
    //   window.postMessage({
    //     eventName: 'authResult',
    //     signature: signature,
    //     sdkSwitch: false
    //   })
    // })
    //-------------------------------------->

    //检测是否时第三方应用 isThirdApp是一个不可修改属性，不用担心串改安全性
    if(tsbSdk.isThirdApp) {
      //如果是第三方应用在转发一层到appPreload中去校验
      window.postMessage({
        eventName: 'preloadAuth',
        checkData: data
      })
    } else {
      //如果不是第三方应用，在tsbSdk中直接校验就行
      window.postMessage({
        eventName: 'authResult',
        signature: 'ts',
        sdkSwitch: true
      })
    }
  },

  handleHideApp: function() {
    if(ipc) {
      ipc.send('sdkHideApp', {appId: tsbSdk.saApp.id})
    } else {
      window.postMessage({
        eventName: 'sdkHideApp',
        saApp: window.tsbSaApp,
        hashTime: window.tsbSDK.hashTime
      })
    }
  },

  newTabNavigate: function(options) {
    if(options.url.length > 0) {
      ipc.send('sdkTabNavigate', options)
    } else {
      return
    }
  },

  handleDestoryApp: function() {
    ipc.send('sdkDestoryApp')
  }

}


module.exports = tsbSdk
