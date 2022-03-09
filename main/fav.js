let localCacheManager=require(path.join(__dirname,'/js/main/localCacheManager.js'))
const { shell } = require('electron')
app.whenReady().then(()=>{
  console.log('ipcon')
  const defaultStorePath=app.getPath('userData')+'/收藏夹.lab'
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

  ipc.on('openDir',(event,args)=>{
    shell.openPath(args.dir)
  })
  ipc.on('showItemInFolder',(event,args)=>{
    shell.showItemInFolder(args.fullPath)
  })
  ipc.on('openExternal',(event,args)=>{
    shell.openExternal('file://'+args.fullPath)
  })
  ipc.on('setWallPaper',(event,args)=>{
    sendIPCToWindow(mainWindow,'setWallPaper',{wallPaper:args.wallPaper,tip:false})
  })
  ipc.on('trashItem',(event,args)=>{
    shell.trashItem(args.fullPath)
  })
  ipc.on('createDir',(event,args)=>{
    try{
      if(fs.existsSync(args.path+'/'+args.dirName)){
        event.reply('createDirResult',{result:'false',message:'存在同名文件夹。'})
        return
      }
      fs.mkdirSync(args.path+'/'+args.dirName)
      if(fs.existsSync(args.path+'/'+args.dirName)){
        event.reply('createDirResult',{result:'true',message:'创建文件夹成功。'})
      }
    }catch(e){
      event.reply('createDirResult',{result:'false',message:'请检查输入是否符合规范。'})
    }
  })
})
