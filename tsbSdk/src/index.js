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
  static events = []

  //私有属性无法在实例化之前从外部去主动改变，只能在内部方法中去改变，防止篡改后对api的滥用
  _sdkSwitch;

  //options中必须要的属性 appId:必填，三方应用唯一标识 、timestamp:必填，生成签名的时间戳、 nonceStr: 必填，生成签名的随机串、 signature:必填，签名、 jsApiList:[]必填，需要使用的JS接口列表
  static config(options) {
    console.log(tsbk.secretInfo, 'tsbk.secretInfo??????????????')
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
      if(!options) return Promise.reject({
        code: 401,
        msg: "SDK接口鉴权失败",
      })
      const keyNames = Object.keys(options);
      for (let i = 0; i < keyNames.length; i++) {
        tsbk.secretInfo[keyNames[i]] = options[keyNames[i]];
      }
    }
  }

  static listener(observe, reverse) {
    window.addEventListener("message", (e) => {
      if(e.data.eventName !== "authResult") return
      if(tsbk.secretInfo.signature !== e.data.signature) {
        console.log('进1', e)
        this._sdkSwitch = false;
        reverse({
          code: 401,
          msg: "SDK接口鉴权失败",
        });
      } else {
        console.log('进2', e)
        this._sdkSwitch = e.data.sdkSwitch;
        observe(this._sdkSwitch);
      }
    });
  }

  static ready(fn) {
    tsbk.config().then((res) => {
      if(res) {
        fn();
      }
    }).catch(err => {
      //验证失败直接丢出错误！
      throw err
    })
    window.addEventListener("message", (e) => {
      let channel = e.data.eventName;
      if(channel){
        tsbk.events.forEach((event, index)=>{
          if(channel===event.eventName){
            event.callBack(e, e.data.args)
            tsbk.events.splice(index, 1)
          }
        })
      } else if(channel.startsWith('tsReply')) {
        tsbk.events.push({
          eventName: channel,
          resInfo: e.data.resInfo
        })
      } else if(channel === 'errorSys') {
        tsbk.events.push({
          eventName: channel,
          errorInfo: e.data.errorInfo
        })
      }
    });
  }

  //主动error接口处理失败验证
  static error(fn) {
    tsbk.config().catch((err) => {
      fn(err);
    });
  }

  //主动去接收消息
  static on(event,callBack){
    tsbk.events.push({
      eventName:event,
      callBack:callBack
    })
  }

  static hideApp(options) {
    if(options && this._sdkSwitch) {
      window.postMessage(
        {
          eventName: "hideApp",
        },
        `${window.origin}`
      );
      options.hasOwnProperty("success") ? options.success() : false;
    } else {
      if(!this._sdkSwitch) {
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
    if(options && this._sdkSwitch) {
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

  static notice(options) {
    if(options && this._sdkSwitch) {
      window.postMessage({
        eventName: 'saAppNotice',
        options: options
      })
      options.hasOwnProperty("success") ? options.success() : false;
    } else {
      if(!this._sdkSwitch) {
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
    if(options && this._sdkSwitch) {
      window.postMessage({
        eventName: 'autoLoginSysApp'
      })
      options.hasOwnProperty("success") ? options.success() : false;
    } else {
      if(!this._sdkSwitch) {
        options.hasOwnProperty("fail") ? options.fail() : false;
        return
      }
      window.postMessage({
        eventName: 'autoLoginSysApp'
      })
    }
  }

  //打开内置某个应用,元社区和团队协作支持跳转具体链接(可选)
  static openSysApp(options) {
    if(options && this._sdkSwitch) {
      window.postMessage({
        eventName: 'openSysApp',
        options: options
      })
      options.hasOwnProperty('success') ? options.success() : false
    } else {
      options.hasOwnProperty("fail") ? options.fail() : false;
      return
    }
  }

  //创建短说圈子邀请链接窗体
  static openOsxInviteMember(options) {
    if(options && this._sdkSwitch) {
      window.postMessage({
        eventName: 'openOsxInviteMember',
        options: options
      })
      options.hasOwnProperty('success') ? options.success() : false
    } else {
      options.hasOwnProperty("fail") ? options.fail() : false;
      return
    }
  }

  //主动获取用户信息
  static getUserProfile(options) {
    console.log(this._sdkSwitch, 'this._sdkSwitch！！！！！！！！！！！！！！！')
    if(!this._sdkSwitch) {
      options.hasOwnProperty('fail') ? options.fail() : false
      return
    }

    window.postMessage({
      eventName: 'getUserProfile',
    })

    //todo

    return new Promise((resolve, reject) => {

      let index = tsbk.events.findIndex(event => event.eventName.startsWith('tsReply'))
      let errIndex = tsbk.events.findIndex(event => event.eventName === 'errorSys')
      if(index < 0 && errIndex !== -1) {
        console.log('走到了这里！！！！！！！！！！！')
        options.hasOwnProperty('fail') ? options.fail() : false
        reject(tsbk.events[errIndex].errorInfo)
        tsbk.events.splice(errIndex, 1)
      }
      if(index > -1) {
        options.hasOwnProperty('success') ? options.success() : false
        resolve(tsbk.events[index].resInfo)
        tsbk.events.splice(index, 1)
      }

    })

  }
}
