window.addEventListener('message', function (e) {
  if (e.data.content) {
    //todo 暂时注销对网页消息的处理，防止被意外唤醒
    // console.log('fav兰街到消息',message)
    // const content = {
    //   href: window.location.href,
    //   ...e.data.content,
    //   title:window.document.title
    // }
    // ipc.send('getFavContent', {content: content})
  }
})
