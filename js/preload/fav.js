window.addEventListener('message', function (e) {
  if (e.data.content) {
    const content = {
      href: window.location.href,
      ...e.data.content,
      title:window.document.title
    }
    console.log('最终得到的采集内容', content)
    ipc.send('getFavContent', {content: content})
  }
})
console.log('监听fav的preload')
