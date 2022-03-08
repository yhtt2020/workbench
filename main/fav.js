let localCacheManager=require(path.join(__dirname,'/js/main/localCacheManager.js'))
app.whenReady().then(()=>{
  console.log('ipcon')
  const defaultStorePath=app.getPath('userData')+'/tmpStore'
  if(!fs.existsSync(defaultStorePath)) fs.mkdirSync(defaultStorePath)
  ipc.on('getUserInfo',(event,args)=>{
    SidePanel.send('getUserInfo',{webContentsId:event.sender.id})
  })
  console.log('ipcon')
  ipc.on('getFavContent',(event,args)=>{
    console.log('收到采集内容的ipc',args)
    const content=args.content
    if(content.type==='pic'){
      let filename=content.src.substr(content.src.lastIndexOf('/'))
      let fullPath= path.join(defaultStorePath,filename)
      localCacheManager.fetchUrl(content.src,fullPath).then(()=>{
        if(fs.existsSync(fullPath)){
          sidePanel.get().webContents.send('message', {type:'success',config:{content:'收藏到本地成功。'}})
        }else{
          sidePanel.get().webContents.send('message', {type:'error',config:{content:'收藏失败，请检查网络。'}})
        }
        console.log('下载成功',fullPath)
      }).catch(e=>{
        sidePanel.get().webContents.send('message', {type:'error',config:{content:'收藏失败，请检查网络。'}})
      })
      console.log(args)
    }

  })
})
