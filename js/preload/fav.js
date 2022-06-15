window.addEventListener('message', function (e) {
  if (e.data.content) {
    const content = {
      href: window.location.href,
      ...e.data.content,
      title:window.document.title
    }
    ipc.send('getFavContent', {content: content})
  }
})
