export default class econstructor {
  constructor(config, self) {
    this.self = self
    this.key = config.key
    //this.xxx = config.xxx
  }
  /**
   * //登出IM跳转短说社区【设置/账号/账号信息
   * @param {String} event ipc发送处理事件名称
   */
  OsxpcBinding(event) {
    const origin = window.location.origin
    window.addEventListener('message', function(e) {
      if(e.origin === origin && e.data === 'OsxpcBinding') {
        ipc.send(event)
      }
    })
  }
}
