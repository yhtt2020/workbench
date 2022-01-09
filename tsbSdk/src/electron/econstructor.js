// export default class econstructor {
//   constructor(config, self) {
//     this.self = self
//   }
//   /**
//    * 登出IM跳转短说社区【设置/账号/账号信息】
//    * @param {String} event ipc发送处理事件名称
//    */
//   OsxpcBinding(event) {
//     const origin = window.location.origin
//     window.addEventListener('message', function(e) {
//       if(e.origin === origin && e.data === 'OsxpcBinding') {
//         ipc.send(event)
//       }
//     })
//   }

//   /**
//    * 登出IM跳转短说社区【设置/账号/用户信息】
//    * @param {String} event ipc发送处理事件名称
//    */
//   OsxpcUserInfo(event) {
//     const origin = window.location.origin
//     window.addEventListener('message', function(e) {
//       if(e.origin === origin && e.data === 'OsxpcUserInfo') {
//         ipc.send(event)
//       }
//     })
//   }
// }

const tsbSdk = {
  //初始化监听
  listener: function() {
    window.addEventListener('message', function(e) {
      let messageEvent = e.data.eventName
      switch(messageEvent) {
        case 'checkAuth':
          tsbSdk.handleCheckAuth(e.data)
          break
        case 'hideApp':
          //
          break
      }
    })
  },

  handleCheckAuth: function(data) {
    const { appId, timestamp, nonceStr, signature, jsApiList } = data.secretInfo
    //解密signature，sha1方法
    //校验解密出来的timestamp、nonceStr是否一致
    //然后再进一步远程ts服务器校验(jsapi_ticket, origin)是否过期，不过期返回一个true，过期返回false
    const axios = require('axios')
    axios.post().then(res => {
      if(res.code === 200) {
        window.postMessage({
          eventName: 'authResult',
          signature: signature,
          sdkSwitch: true
        })
      } else {
        window.postMessage({
          eventName: 'authResult',
          signature: signature,
          sdkSwitch: false
        })
      }
    }).catch(err => {
      window.postMessage({
        eventName: 'authResult',
        signature: signature,
        sdkSwitch: false
      })
    })

  }


}
