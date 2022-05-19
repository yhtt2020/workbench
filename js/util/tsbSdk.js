const xss = require("xss");
const axios = require('axios')
const { config, api } = require('../../server-config')

axios.defaults.baseURL = config.NODE_SERVER_BASE_URL;
axios.defaults.adapter = require('axios/lib/adapters/http');


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
      eventName: eventName === 'receivePermission' ? 'receivePermission' : eventName === 'errorSys' ? 'errorSys' : `tsReply${newEventName}`,
      resInfo,
      errorInfo,
      id
    })
  },

  defaultEventName: [
    'hideApp',
    "openSysApp",
    "openOsxInviteMember",
    'getUserProfile',
    'checkBrowserLogin',
    'openPermissionWindow',
  ],

  handleSdkEvent(eventName, id, e) {
    if(this.defaultEventName.includes(eventName)) {
      e.data.options ?
      this[eventName](eventName, id, e.data.options) : this[eventName](eventName, id)
    } else {
      return
    }
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
          try {
            Dep[0].func(Dep[0].host);
            tsbSdk.bridgeToWeb({eventName, resInfo: {code: 200, msg: '成功'}, id})
          } catch (error) {
            tsbSdk.bridgeToWeb({eventName: 'errorSys', errorInfo: {code: 500, msg: `失败${error}`}, id})
          }
          break;
        default:
          tsbSdk.handleSdkEvent(eventName, id, e)
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
  },

  checkBrowserLogin: function (eventName, id) {
    if(!tsbSdk.isThirdApp) {
      ipc.invoke('saAppCheckBrowserLogin').then(res => {
        tsbSdk.bridgeToWeb({eventName, resInfo: res, id})
      }).catch(err => {
        tsbSdk.bridgeToWeb({eventName: 'errorSys', errorInfo: err, id})
      })
    } else {
      tsbSdk.bridgeToPreload({eventName, id})
    }
  },

  openPermissionWindow: function (eventName, id, options) {
    options.windowId = tsbSdk.tsbSaApp.windowId
    options.favicon = tsbSdk.tsbSaApp.logo
    if(!tsbSdk.isThirdApp) {
      ipc.invoke('saAppOpenPermissionWindow', options).then(res => {
        tsbSdk.bridgeToWeb({eventName, resInfo: res, id})
      }).catch(err => {
        tsbSdk.bridgeToWeb({eventName: 'errorSys', errorInfo: err, id})
      })
    } else {
      tsbSdk.bridgeToPreload({eventName, options, id})
    }
  },

  onThirdAutoLogin: function(ipc) {
    //这个方法调用的时候浏览器侧的sdk是没有ipc环境，只能从appPreload中传入
    const eventReplyCallback = async (event, args) => {
      try {
        const result = await axios({
          timeout:5000,
          method: 'post',
          url: api.NODE_API_URL.ENTITY_APP.AUTO_LOGIN,
          headers: { Authorization: args.userToken },
          data: {
            client_id: args.clientId,
            bind_id: args.bindId
          }
        })
        if(result.status === 200 && result.data.code === 1000) {
          tsbSdk.bridgeToWeb({eventName: 'receivePermission', resInfo: {code: 200, msg: '成功', data: Object.assign(result.data.data, args.premissionedData.userInfo) }})
          ipc.send('closePermissionWin')
        } else {
          tsbSdk.bridgeToWeb({eventName: 'receivePermission', resInfo: {code: 500, msg: '授权登录失败'}})
        }
      } catch (err) {
        tsbSdk.bridgeToWeb({eventName: 'receivePermission', resInfo: {code: 500, msg: '授权登录失败'}})
      }
    }
    ipc.on('replyEntityLogin', eventReplyCallback)
  },
  /**
   * 向内容页面发送消息，遵循ipc的规则
   * @param event 消息频道
   * @param args 数据
   */
  send(event,args){
    window.postMessage({
      eventName: event,
      args
    });
  }
};

module.exports = tsbSdk;
