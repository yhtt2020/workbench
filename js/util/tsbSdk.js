const xss = require("xss");

const tsbSdk = {
  isThirdApp: Boolean,
  tsbSaApp: null,
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
      let messageEvent = e.data.eventName;
      let id = e.data.id;
      switch (messageEvent) {
        case "checkAuth":
          tsbSdk.handleCheckAuth(id);
          break;
        case "hideApp":
          tsbSdk.handleHideApp();
          break;
        case "tabLinkJump":
          e.data.url = xss(e.data.url);
          tsbSdk.newTabNavigate(e.data);
          break;
        case "destoryApp":
          tsbSdk.handleDestoryApp();
          break;
        case "saAppNotice":
          e.data.options.title = xss(e.data.options.title);
          e.data.options.body = xss(e.data.options.body);
          //console.log(e.data.options.body, '输出转码后的')
          tsbSdk.noticeApp(e.data.options);
          break;
        case "autoLoginSysApp":
          Dep[0].func(Dep[0].host);
          break;
        case "openSysApp":
          tsbSdk.openSysApp(e.data.options);
          break;
        case "openOsxInviteMember":
          tsbSdk.openOsxInviteMember(e.data.options);
          break;
        case 'getUserProfile':
          tsbSdk.getUserProfile(id)
          break;
        default:
          console.log(messageEvent, "未命中🎯");
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

  handleHideApp: function () {
    if (!tsbSdk.isThirdApp) {
      ipc.send("saAppHide", { appId: tsbSdk.tsbSaApp.id });
    } else {
      window.postMessage({
        eventName: "saAppHide",
        saApp: tsbSdk.tsbSaApp,
        hashId: tsbSdk.tsbSaApp.hashId,
      });
    }
  },

  newTabNavigate: function (options) {
    if (!tsbSdk.isThirdApp) {
      if (options.url.length > 0) {
        ipc.send("saAppTabNavigate", options);
      } else {
        return;
      }
    } else {
      window.postMessage({
        eventName: "saAppTabNavigate",
        options,
        saApp: tsbSdk.tsbSaApp,
        hashId: tsbSdk.tsbSaApp.hashId,
      });
    }
  },

  noticeApp: function (options) {
    if (
      !options.hasOwnProperty("title") ||
      !options.hasOwnProperty("body") ||
      !options.hasOwnProperty("avatar") ||
      Object.keys(options).length <= 0
    )
      return;

    if (!tsbSdk.isThirdApp) {
      ipc.send("saAppNotice", { options, saAppId: tsbSdk.tsbSaApp.id });
    } else {
      window.postMessage({
        eventName: "thirdSaAppNotice",
        options,
        saApp: tsbSdk.tsbSaApp,
        hashId: tsbSdk.tsbSaApp.hashId,
      });
    }
  },

  openSysApp: function (options) {
    const sysApp = [
      { appName: "团队协作", id: 1 },
      { appName: "元社区", id: 2 },
      { appName: "收藏夹", id: 3 },
      { appName: "导入助手", id: 4 },
    ];

    if (Object.keys(options).length === 0) return;

    if ((options.url && options.url.length === 0) || !options.appName) return;

    if (!sysApp.some((v) => v.appName === options.appName)) return;

    let sysAppIndex = sysApp.findIndex((v) => v.appName === options.appName);

    if (!tsbSdk.isThirdApp) {
      ipc.send("saAppOpen", { options, saAppId: sysApp[`${sysAppIndex}`].id });
    } else {
      window.postMessage({
        eventName: "thirdSaAppOpen",
        options,
        saApp: tsbSdk.tsbSaApp,
        hashId: tsbSdk.tsbSaApp.hashId,
      });
    }
  },

  openOsxInviteMember: function (options) {
    if (Object.keys(options).length === 0) return;
    if (!options.groupId) return;
    if (!tsbSdk.isThirdApp) {
      ipc.send("osxOpenInviteMember", options.groupId);
    } else {
      window.postMessage({
        eventName: "thirdOsxOpenInviteMember",
        options,
        saApp: tsbSdk.tsbSaApp,
        hashId: tsbSdk.tsbSaApp.hashId,
      });
    }
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
  },

  getUserProfile: function (id) {
    if(!tsbSdk.isThirdApp) {
        ipc.invoke('saAppGetUserProfile').then(res => {
        window.postMessage({
          eventName: 'tsReplyGetUserProfile',
          resInfo: res,
          id
        })
      }).catch(err => {
        window.postMessage({
          eventName: 'errorSys',
          errorInfo: err,
          id
        })
      })
    } else {
      window.postMessage({
        eventName: 'thirdGetUserProfile',
        saApp: tsbSdk.tsbSaApp,
        hashId: tsbSdk.tsbSaApp.hashId,
        id
      })
    }
  }
};

module.exports = tsbSdk;
