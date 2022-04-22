const xss = require("xss");

const tsbSdk = {
  isThirdApp: Boolean,
  tsbSaApp: null,

  /**
   * 消息发送桥梁 发送到appPreload的桥梁
   * @param {Object} {} 属性包含[必填]eventName,[可选]options,[可选]id
   */
  bridgeToPreload: function ({eventName, options = null, id = null} = {}) {
    let newEventName = eventName.replace(/( |^)[a-z]/g, (L) => L.toUpperCase())
    window.postMessage({
      eventName: `third${newEventName}`,
      options,
      saApp: tsbSdk.tsbSaApp,
      hashId: tsbSdk.tsbSaApp.hashId,
      id
    })
  },

  /**
   * 消息发送桥梁 发送到应用侧sdk的桥梁
   * @param {Object} {} 属性包含[必填]eventName,[必填]id,[可选]resInfo,[可选]errorInfo
   */
  bridgeToWeb: function ({eventName, resInfo = null, errorInfo = null, id = null} = {}) {
    let newEventName = eventName.replace(/( |^)[a-z]/g, (L) => L.toUpperCase())
    window.postMessage({
      eventName: eventName === 'errorSys' ? 'errorSys' : `tsReply${newEventName}`,
      resInfo,
      errorInfo,
      id
    })
  },


  //初始化监听
  listener: function (saApp, Dep) {
    if(saApp) {
      tsbSdk.tsbSaApp = saApp
      tsbSdk.tsbSaApp.isSystemApp
      ? Object.defineProperty(tsbSdk, "isThirdApp", {
          writable: false,
          value: false,
        })
      : Object.defineProperty(tsbSdk, "isThirdApp", {
          writable: false,
          value: true,
        });
    }

    window.addEventListener("message", async function (e) {
      let eventName = e.data.eventName;
      let id = e.data.id;
      switch (eventName) {
        case "checkAuth":
          tsbSdk.handleCheckAuth(id);
          break;
        case "hideApp":
          tsbSdk.hideApp(eventName, id);
          break;
        case "tabLinkJump":
          e.data.options.url = xss(e.data.options.url);
          tsbSdk.tabLinkJump(eventName, id, e.data.options);
          break;
        case "notice":
          e.data.options.title = xss(e.data.options.title);
          e.data.options.body = xss(e.data.options.body);
          //console.log(e.data.options.body, '输出转码后的')
          tsbSdk.notice(eventName, id, e.data.options);
          break;
        case "autoLoginSysApp":
          Dep[0].func(Dep[0].host);
          break;
        case "openSysApp":
          tsbSdk.openSysApp(eventName, id, e.data.options);
          break;
        case "openOsxInviteMember":
          tsbSdk.openOsxInviteMember(eventName, id, e.data.options);
          break;
        case 'getUserProfile':
          tsbSdk.getUserProfile(eventName, id)
          break;
        default:
          console.log(eventName, "未命中🎯");
      }
    });
    console.log(tsbSdk.tsbSaApp, tsbSdk, "挂载了SDK");
  },

  handleCheckAuth: function (id) {
    window.postMessage({
      eventName: 'authResult',
      auth: true,
      id
    })

    // const { appId, timestamp, nonceStr, signature, jsApiList } = data.secretInfo
    // 解密signature，sha1方法
    // 校验解密出来的timestamp、nonceStr是否一致，初步校验signature是否为被伪造
    // 是伪造的话直接就return 一个错误，在web一侧的sdk收到这个errorSys，直接reject鉴权失败
    // 然后再进一步远程ts服务器校验(jsapi_ticket, origin)是否过期，不过期返回一个true，过期返回false
    // const axios = require('axios')
    // axios.post().then(res => {
    //   if(res.code === 200) {
    //     window.postMessage({
    //       eventName: 'authResult',
    //       auth: true
    //     })
    //   } else {
    //     window.postMessage({
    //       eventName: 'authResult',
    //       auth: false
    //     })
    //   }
    // }).catch(err => {
    //   window.postMessage({
    //     eventName: 'authResult',
    //     auth: false
    //   })
    // })
    // -------------------------------------->
  },

  hideApp: function (eventName, id) {
    try {
      let options = {}
      options.appId = tsbSdk.tsbSaApp.id
      if (!tsbSdk.isThirdApp) {
        ipc.invoke('saAppHideApp', options).then(res => {
          tsbSdk.bridgeToWeb({eventName, resInfo: res, id})
        }).catch(err => {
          tsbSdk.bridgeToWeb({eventName: 'errorSys', errorInfo: err, id})
        })
      } else {
        tsbSdk.bridgeToPreload({eventName, options, id})
      }
    } catch (error) {
      tsbSdk.bridgeToWeb({eventName: 'errorSys', errorInfo: error, id})
    }
  },

  tabLinkJump: function (eventName, id, options) {
    if (!tsbSdk.isThirdApp) {
      ipc.invoke('saAppTabLinkJump', options).then(res => {
        tsbSdk.bridgeToWeb({eventName, resInfo: res, id})
      }).catch(err => {
        tsbSdk.bridgeToWeb({eventName: 'errorSys', errorInfo: err, id})
      })
    } else {
      tsbSdk.bridgeToPreload({eventName, options, id})
    }
  },

  notice: function (eventName, id, options) {
    try {
      options.saAppId = tsbSdk.tsbSaApp.id

      if (!tsbSdk.isThirdApp) {
        ipc.invoke('saAppNotice', options).then(res => {
          tsbSdk.bridgeToWeb({eventName, resInfo: res, id})
        }).catch(err => {
          tsbSdk.bridgeToWeb({eventName: 'errorSys', errorInfo: err, id})
        })
      } else {
        tsbSdk.bridgeToPreload({eventName, options, id})
      }
    } catch (error) {
      tsbSdk.bridgeToWeb({eventName: 'errorSys', errorInfo: error, id})
    }
  },

  openSysApp: function (eventName, id, options) {
    if (!tsbSdk.isThirdApp) {
      ipc.invoke('saAppOpenSysApp', options).then(res => {
        tsbSdk.bridgeToWeb({eventName, resInfo: res, id})
      }).catch(err => {
        tsbSdk.bridgeToWeb({eventName: 'errorSys', errorInfo: err, id})
      })
    } else {
      tsbSdk.bridgeToPreload({eventName, options, id})
    }
  },

  openOsxInviteMember: function (eventName, id, options) {
    if (!tsbSdk.isThirdApp) {
      ipc.invoke('saAppOsxOpenInviteMember', options.groupId).then(res => {
        tsbSdk.bridgeToWeb({eventName, resInfo: res, id})
      }).catch(err => {
        tsbSdk.bridgeToWeb({eventName: 'errorSys', errorInfo: err, id})
      })
    } else {
      tsbSdk.bridgeToPreload({eventName, options, id})
    }
  },

  getUserProfile: function (eventName, id) {
    if(!tsbSdk.isThirdApp) {
      ipc.invoke('saAppGetUserProfile').then(res => {
        tsbSdk.bridgeToWeb({eventName, resInfo: res, id})
      }).catch(err => {
        tsbSdk.bridgeToWeb({eventName: 'errorSys', errorInfo: err, id})
      })
    } else {
      tsbSdk.bridgeToPreload({eventName, id})
    }
  }
};

module.exports = tsbSdk;
