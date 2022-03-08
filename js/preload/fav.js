window.addEventListener('message', function (e) {
  const content={
    href:e.origin,
    ...e.data.content
  }
  console.log('最终得到的采集内容',content)
  ipc.send('getFavContent',{content:content})
})
console.log('监听fav的preload')
