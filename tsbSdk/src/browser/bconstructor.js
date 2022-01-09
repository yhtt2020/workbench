export default class bconstructor {
  //web项目中嵌入另一个第三方web项目。利用iFrame.contentWindow.postMessage解决同源策略限制
  constructor(config, self) {
    this.self = self
    //暂时先这样
    //微信jssdk是同一个url仅需调用一次，对于变化url的SPA的web app可在每次url变化时进行调用
    //我们设计成同一个origin仅需调用一次
    //后期给第三方应用一个接口调取jsapi_ticket（有效期7200秒，开发者必须在自己的服务全局缓存jsapi_ticket）
    //jsapi_ticket之后，就可以生成tsb-SDK权限验证的签名了
    //签名生成规则如下：参与签名的字段包括noncestr（随机字符串）, 有效的jsapi_ticket, timestamp（时间戳）, url（第三方开发商网站的Origin）
    //对所有待签名参数按照字段名的ASCII 码从小到大排序（字典序）后，使用URL键值对的格式（即key1=value1&key2=value2…）拼接成字符串string
    //对string进行sha1签名，得到signature
    this.accessKey = config.accessKey
  }

  static secretInfo = {}

  //obj中必须要的属性 appId:必填，三方应用唯一标识 、timestamp:必填，生成签名的时间戳、 nonceStr: 必填，生成签名的随机串、 signature:必填，签名、 jsApiList:[]必填，需要使用的JS接口列表
  static config(obj) {
    if (Object.keys(bconstructor.secretInfo).length > 0) {
      window.postMessage({
        eventName: 'checkAuth',
        secretInfo: bconstructor.secretInfo
      }, `${window.origin}`)
    } else {
      const keyNames = Object.keys(obj)
      for(let i = 0; i < keyNames.length; i++) {
        bconstructor.secretInfo[keyNames[i]] = obj[keyNames[i]]
      }
      window.postMessage({
        eventName: 'checkAuth',
        secretInfo: bconstructor.secretInfo
      }, `${window.origin}`)
    }
  }

  static ready(fn) {
    //检查是否过期，
  }



  // //登出IM跳转短说社区【设置/账号/账号信息】
  // OsxpcBinding() {
  //   window.postMessage('OsxpcBinding', `${window.origin}`)
  // }

  // //登出IM跳转短说社区【设置/账号/用户信息】
  // OsxpcUserInfo() {
  //   window.postMessage('OsxpcUserInfo', `${window.origin}`)
  // }
}
