export const noticeHandler = {
  on({event, data}) {
    switch (event) {
      case 'onReceived':
        console.error('全局通知到达', event, data)
        window.$notice.notice(data)
    }
  }
}
