export default class bconstructor {
  constructor(config, self) {
    this.self = self
    this.key = config.key
    //this.xxx = config.xxx
  }
  //登出IM跳转短说社区【设置/账号/账号信息】
  OsxpcBinding() {
    const setIframe = () => {
      const iframe = document.createElement('iframe')
      iframe.style = 'display:none'
      iframe.src = "http://127.0.0.1:8000"
      document.body.appendChild(iframe)
      iframe.onload = function() {
        iframe.contentWindow.postMessage('OsxpcBinding', '*')
      }
    }
    setIframe()
  }
}
