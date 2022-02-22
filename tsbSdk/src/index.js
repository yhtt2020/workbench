export default class tsbk {
  //web项目中嵌入另一个第三方web项目。利用iFrame.contentWindow.postMessage解决同源策略限制
  constructor(config, self) {
    this.self = self;
    //暂时先这样
    //微信jssdk是同一个url仅需调用一次，对于变化url的SPA的web app可在每次url变化时进行调用
    //我们设计成同一个origin仅需调用一次
    //后期给第三方应用一个接口调取jsapi_ticket（有效期7200秒，开发者必须在自己的服务全局缓存jsapi_ticket）
    //jsapi_ticket之后，就可以生成tsb-SDK权限验证的签名了
    //签名生成规则如下：参与签名的字段包括noncestr（随机字符串）, 有效的jsapi_ticket, timestamp（时间戳）, url（第三方开发商网站的Origin）
    //对所有待签名参数按照字段名的ASCII 码从小到大排序（字典序）后，使用URL键值对的格式（即key1=value1&key2=value2…）拼接成字符串string
    //对string进行sha1签名，得到signature
    this.accessKey = config.accessKey;
  }

  static secretInfo = {};
  static sdkSwitch = false;

  //options中必须要的属性 appId:必填，三方应用唯一标识 、timestamp:必填，生成签名的时间戳、 nonceStr: 必填，生成签名的随机串、 signature:必填，签名、 jsApiList:[]必填，需要使用的JS接口列表
  static config(options) {
    if (Object.keys(tsbk.secretInfo).length > 0) {
      return new Promise((resolve, reject) => {
        window.postMessage(
          {
            eventName: "checkAuth",
            secretInfo: tsbk.secretInfo,
          },
          `${window.origin}`
        );
        tsbk.listener(resolve, reject);
      });
    } else {
      const keyNames = Object.keys(options);
      for (let i = 0; i < keyNames.length; i++) {
        tsbk.secretInfo[keyNames[i]] = options[keyNames[i]];
      }
    }
  }

  static listener(observe, reverse) {
    window.addEventListener("message", function (e) {
      let messageEvent = e.data.eventName;
      switch (messageEvent) {
        case "authResult":
          if (tsbk.secretInfo.signature === e.data.signature) {
            tsbk.sdkSwitch = e.data.sdkSwitch;
            observe(tsbk.sdkSwitch);
          } else {
            tsbk.sdkSwitch = false;
            reverse({
              code: 401,
              msg: "SDK接口鉴权失败",
            });
          }
          break;
      }
    });
  }

  static ready(fn) {
    tsbk.config().then((res) => {
      fn();
    });
  }

  static error(fn) {
    tsbk.config().catch((err) => {
      fn(err);
    });
  }

  static hideApp(options) {
    if(options && tsbk.sdkSwitch) {
      window.postMessage(
        {
          eventName: "hideApp",
        },
        `${window.origin}`
      );
      options.hasOwnProperty("success") ? options.success() : false;
    } else {
      if(!tsbk.sdkSwitch) {
        options.hasOwnProperty("fail") ? options.fail() : false;
        return
      }
      window.postMessage(
        {
          eventName: "hideApp",
        },
        `${window.origin}`
      );
    }
  }

  static tabLinkJump(options) {
    if(options && tsbk.sdkSwitch) {
      window.postMessage({
        eventName: "tabLinkJump",
        url: options.url ?? "",
      });
      options.hasOwnProperty("success") ? options.success() : false;
    } else {
      options.hasOwnProperty("fail") ? options.fail() : false;
      return
    }
  }

  //暂时废弃
  // static destoryApp(options) {
  //   window.postMessage(
  //     {
  //       eventName: "destoryApp",
  //     },
  //     `${window.origin}`
  //   );
  //   if (options) {
  //     if (tsbk.sdkSwitch) {
  //       options.hasOwnProperty("success") ? options.success() : false;
  //     } else {
  //       options.hasOwnProperty("fail") ? options.fail() : false;
  //     }
  //   } else {
  //     return;
  //   }
  // }

  static notice(options) {
    if(options && tsbk.sdkSwitch) {
      window.postMessage({
        eventName: 'saAppNotice',
        options: options
      })
      options.hasOwnProperty("success") ? options.success() : false;
    } else {
      if(!tsbk.sdkSwitch) {
        options.hasOwnProperty("fail") ? options.fail() : false;
        return
      }
      window.postMessage({
        eventName: 'saAppNotice',
        options: options
      })
    }
  }

  //登录想天内置应用的免登 //todo 未来还要单独做一套第三方应用的免登
  static autoLoginSysApp(options) {
    if(options && tsbk.sdkSwitch) {
      window.postMessage({
        eventName: 'autoLoginSysApp'
      })
      options.hasOwnProperty("success") ? options.success() : false;
    } else {
      if(!tsbk.sdkSwitch) {
        options.hasOwnProperty("fail") ? options.fail() : false;
        return
      }
      window.postMessage({
        eventName: 'autoLoginSysApp'
      })
    }
  }
}
