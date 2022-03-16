const xss = require("xss");

const tsbSdk = {
  isThirdApp: Boolean,
  tsbSaApp: JSON.parse(localStorage.getItem("tsbSaApp")),
  //初始化监听
  listener: function (Dep) {
    if (tsbSdk.tsbSaApp) {
      tsbSdk.tsbSaApp.isSystemApp
        ? Object.defineProperty(tsbSdk, "isThirdApp", {
            writable: false,
            value: false,
          })
        : Object.defineProperty(tsbSdk, "isThirdApp", {
            writable: false,
            value: true,
          });
    } else {
      Object.defineProperty(tsbSdk, "isThirdApp", {
        writable: false,
        value: true,
      });
    }
    window.addEventListener("message", function (e) {
      let messageEvent = e.data.eventName;
      switch (messageEvent) {
        case "checkAuth":
          tsbSdk.handleCheckAuth(e.data);
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
        case "preloadAuthResult":
          //todo后面根据preload的真正返回data返回
          window.postMessage({
            eventName: "authResult",
            signature: "ts",
            sdkSwitch: true,
          });
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
        case 'openOsxInviteMember':
          tsbSdk.openOsxInviteMember(e.data.options)
          break;
        default:
          console.log(messageEvent, "未命中🎯");
      }
    });
    console.log(tsbSdk.tsbSaApp, tsbSdk, "挂载了SDK");
  },

  handleCheckAuth: function (data) {
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
    if (tsbSdk.isThirdApp) {
      //如果是第三方应用在转发一层到appPreload中去校验
      window.postMessage({
        eventName: "preloadAuth",
        checkData: data,
      });
    } else {
      //如果不是第三方应用，在tsbSdk中直接校验就行
      window.postMessage({
        eventName: "authResult",
        signature: "ts",
        sdkSwitch: true,
      });
    }
  },

  handleHideApp: function () {
    if (!tsbSdk.isThirdApp) {
      ipc.send("saAppHide", { appId: tsbSdk.tsbSaApp.id });
    } else {
      window.postMessage({
        eventName: "saAppHide",
        saApp: window.tsbSaApp,
        hashId: window.tsbSDK.hashId,
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
        saApp: window.tsbSaApp,
        hashId: window.tsbSDK.hashId,
      });
    }
  },

  noticeApp: function (options) {
    if (!tsbSdk.isThirdApp) {
      if (
        Object.keys(options).length > 0 &&
        options.title.length > 0 &&
        options.body.length > 0
      ) {
        ipc.send("saAppNotice", { options, saAppId: tsbSdk.tsbSaApp.id });
      } else {
        return;
      }
    } else {
      window.postMessage({
        eventName: "thirdSaAppNotice",
        options,
        saApp: window.tsbSaApp,
        hashId: window.tsbSDK.hashId,
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
        saApp: window.tsbSaApp,
        hashId: window.tsbSDK.hashId,
      });
    }
  },

  openOsxInviteMember: function (options) {
    if (Object.keys(options).length === 0) return;
    if(!options.groupId) return;
    if (!tsbSdk.isThirdApp) {
      ipc.send('osxOpenInviteMember', options.groupId)
    } else {
      window.postMessage({
        eventName: 'thirdOsxOpenInviteMember',
        options,
        saApp: window.tsbSaApp,
        hashId: window.tsbSDK.hashId,
      })
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
  }
};

module.exports = tsbSdk;
