export default class bconstructor {
  //web项目中嵌入另一个第三方web项目。利用iFrame.contentWindow.postMessage解决同源策略限制
  constructor(config, self) {
    this.self = self
    this.key = config.key
    //this.xxx = config.xxx
  }

  //登出IM跳转短说社区【设置/账号/账号信息】
  OsxpcBinding() {
    window.postMessage('OsxpcBinding', `${window.origin}`)
  }

  //登出IM跳转短说社区【设置/账号/用户信息】
  OsxpcUserInfo() {
    window.postMessage('OsxpcUserInfo', `${window.origin}`)
  }
}
