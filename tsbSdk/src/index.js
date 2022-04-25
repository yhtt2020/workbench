class EventBus {
  id = 0;
  events = new Map;

  constructor() {
    window.addEventListener('message', event => {
      let channel = event.data.eventName;
      if (channel && channel.startsWith('tsReply')) {
        const callback = this.events.get(event.data.id);
        callback(event.data.resInfo)
        this.events.delete(event.data.id);
      } else if (channel === 'errorSys') {
        const callback = this.events.get(event.data.id);
        callback(null, event.data.errorInfo);
        this.events.delete(event.data.id)
      } else if (channel === 'authResult') {
        const callback = this.events.get(event.data.id);
        callback(event.data.auth);
        //if 有真正的鉴权，判断auth返回是否是一个true，不是的话callback(event.data.auth)回调返回的就是一个false
        this.events.delete(event.data.id)
      }
    });
  }

  dispatch(eventName, callBack, options) {
    this.id += 1;
    this.events.set(this.id, callBack);
    if(eventName === 'checkAuth') {
      window.postMessage({
        eventName,
        id: this.id,
        secretInfo: tsbk.secretInfo
      })
      return
    }
    window.postMessage({ eventName, id: this.id, options });
  }
}

const eventBus = new EventBus();

export default class tsbk {
  constructor(config, self) {
    this.self = self;
    this.accessKey = config.accessKey;
    //web项目中嵌入另一个第三方web项目。利用iFrame.contentWindow.postMessage解决同源策略限制
    //暂时先这样 微信jssdk是同一个url仅需调用一次，对于变化url的SPA的web app可在每次url变化时进行调用
    //我们设计成同一个origin仅需调用一次
    //后期给第三方应用一个接口调取jsapi_ticket（有效期7200秒，开发者必须在自己的服务全局缓存jsapi_ticket）
    //jsapi_ticket之后，就可以生成tsb-SDK权限验证的签名了
    //签名生成规则如下：参与签名的字段包括noncestr（随机字符串）, 有效的jsapi_ticket, timestamp（时间戳）, url（第三方开发商网站的Origin）
    //对所有待签名参数按照字段名的ASCII 码从小到大排序（字典序）后，使用URL键值对的格式（即key1=value1&key2=value2…）拼接成字符串string
    //对string进行sha1签名，得到signature
  }

  static secretInfo = {};
  static events = []
  static newSecretInfoFunc = () => {}

  //options中必须要的属性 appId:必填，三方应用唯一标识 、timestamp:必填，生成签名的时间戳、 nonceStr: 必填，生成签名的随机串、 signature:必填，签名、 jsApiList:[]必填，需要使用的JS接口列表
  static config(options) {
    if(Object.keys(tsbk.secretInfo).length === 0) {
      if(!options || toString.call(options) !== '[object Object]' || Object.keys(options).length === 0) return Promise.reject({
        code: 401,
        msg: "SDK接口鉴权失败",
      })
      tsbk.secretInfo = options
    } else {
      return new Promise((resolve, reject) => {
        eventBus.dispatch('checkAuth', res => {
          res ? resolve(res) : reject({code: 401, msg: 'SDK接口鉴权失败'})
        })
      })
    }
  }

  /**
   * ready准备函数，每次调用都会重新去执行config鉴权函数
   * @param {function} fn 回调函数，具体方法执行的函数
   * @param {boolean} autoRefresh 是否自动刷新续签
   */
  static ready(fn, autoRefresh = false) {
    tsbk.config(tsbk.secretInfo).then(() => {
      fn()
    }).catch(err => {
      if(autoRefresh) {
        tsbk.newSecretInfoFunc().then(res2 => {
          tsbk.secretInfo = res2
          tsbk.ready(fn, true) //重新验证后直接去递归执行一次操作
        }).catch(err2 => {
          throw err2
        })
      } else {
        throw err   //验证失败直接丢出错误!
      }
    })
  }

  //注入重新获取过期jsapi_ticket的函数方法，请返回一个完整的promise对象，内容是签名传参格式
  static setNewSecretInfoFunc(fn) {
    tsbk.newSecretInfoFunc = fn
  }

  static hideApp() {
    return new Promise((resolve, reject) => {
      eventBus.dispatch('hideApp', (res, err) => {
        res ? resolve(res) : reject(err)
      });
    })
  }

  static tabLinkJump(options) {
    return new Promise((resolve, reject) => {
      if (Object.keys(options).length === 0) { reject({code: 400, msg: '参数不能为空'}) };
      if (!options.hasOwnProperty("url")) { reject({code: 400, msg: 'url参数不存在'}) };
      if (options.url.length === 0 ) { reject({code: 400, msg: 'url参数错误'}) };

      eventBus.dispatch('tabLinkJump', (res, err) => {
        res ? resolve(res) : reject(err)
      }, options)
    })
  }

  static notice(options) {
    return new Promise((resolve, reject) => {
      if (
        !options.hasOwnProperty("title") ||
        !options.hasOwnProperty("body") ||
        !options.hasOwnProperty("avatar") ||
        Object.keys(options).length === 0
      ) { reject({code: 400, msg: '参数错误'}) };

      eventBus.dispatch('notice', (res, err) => {
        res ? resolve(res) : reject(err)
      }, options)
    })
  }

  //打开内置某个应用,元社区和团队协作支持跳转具体链接(可选)
  static openSysApp(options) {
    return new Promise((resolve, reject) => {
      const sysApp = [
        { appName: "团队协作", id: 1 },
        { appName: "元社区", id: 2 },
        { appName: "收藏夹", id: 3 },
        { appName: "导入助手", id: 4 },
      ];

      if (Object.keys(options).length === 0) { reject({code: 400, msg: '参数不能为空'}) };

      if ((options.url && options.url.length === 0) || !options.appName) { reject({code: 400, msg: 'appName参数或url参数错误'}) };

      if (!sysApp.some((v) => v.appName === options.appName)) { reject({code: 400, msg: 'appName参数错误'}) };

      let sysAppIndex = sysApp.findIndex((v) => v.appName === options.appName);

      options.saAppId = sysApp[sysAppIndex].id

      eventBus.dispatch('openSysApp', (res, err) => {
        res ? resolve(res) : reject(err)
      }, options)
    })
  }

  //创建短说圈子邀请链接窗体
  static openOsxInviteMember(options) {
    return new Promise((resolve, reject) => {
      if (Object.keys(options).length === 0) { reject({code: 400, msg: '参数不能为空'}) };
      if (!options.groupId) { reject({code: 400, msg: 'groupId参数错误'}) };
      eventBus.dispatch('openOsxInviteMember', (res, err) => {
        res ? resolve(res) : reject(err)
      }, options)
    })
  }

  //主动获取用户信息
  static getUserProfile() {
    return new Promise((resolve, reject) => {
      eventBus.dispatch('getUserProfile', (res, err) => {
        res ? resolve(res) : reject(err)
      });
    });
  }


  //登录想天内置应用的免登
  static autoLoginSysApp() {
    return new Promise((resolve, reject) => {
      eventBus.dispatch('autoLoginSysApp', (res, err) => {
        res ? resolve(res) : reject(err)
      })
    })
  }
}
