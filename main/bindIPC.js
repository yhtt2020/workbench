app.whenReady().then(()=>{
  //设置默认浏览器部分代码开始
//获取默认浏览器
  ipc.on('getIsDefaulBrowser',function(event){
    let isDefault=app.isDefaultProtocolClient('http')
    // console.log('返回是不是默认浏览器'+isDefault)
    event.reply('returnIsDefaultBrowser',isDefault)
  })
//移除默认浏览器
  ipc.on('callSetOrRemoveDefaultBrowser',async function(event,args){
    if(app.isDefaultProtocolClient('http')){
      if(process.platform==='win32'){
        try {
          registryInstaller.uninstall()
          event.reply('setBrowserReturn',{type:'delete',success:true,info:'注册表清理成功'})
        }
        catch(e){
          event.reply('setBrowserReturn',{type:'delete',success:false,info:e})
        }
      }
      app.removeAsDefaultProtocolClient('http')
    }else{
      if(process.platform==='win32'){
        try {
          registryInstaller.install()
          event.reply('setBrowserReturn',{type:'reg',success:true,info:'注册表添加成功'})
        }
        catch(e){
          event.reply('setBrowserReturn',{type:'reg',success:false,info:e})
        }
      }
      app.setAsDefaultProtocolClient('http')
    }
  })
})
