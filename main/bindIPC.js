app.whenReady().then(()=>{
  //设置默认浏览器部分代码开始
//获取默认浏览器
  ipc.on('getIsDefaulBrowser',function(event){
    let isDefault=app.isDefaultProtocolClient('http')
    //console.log('返回是不是默认浏览器'+isDefault)
    event.reply('returnIsDefaultBrowser',isDefault)
  })
//移除默认浏览器
  ipc.on('callSetOrRemoveDefaultBrowser',async function(event,args){
    // console.log(args.systemInfo)
    //args.systemInfo
    //{
    // [1]   platformAlias: 'Windows',
    // [1]   versionAlias: 'win10',
    // [1]   platform: 'win32',
    // [1]   systemVersion: '10.0.19042'
    // [1] }
    if(app.isDefaultProtocolClient('http')){
      if(process.platform==='win32'){
        try {
          registryInstaller.uninstall()
          event.reply('setBrowserReturn',{type:'delete',success:true,info:'注册表清理成功'})
        }
        catch(e){
          event.reply('setBrowserReturn',{type:'delete',success:false,info:e})
        }


        // await registryInstaller.uninstall().then(()=>{
        //     console.log('uninstall success')
        //     event.reply('setBrowserReturn',{type:'delete',success:true,info:'卸载注册表成功'})
        // }).catch((err)=>{
        //   console.log('uninstall error')
        //   console.log(err)
        //   event.reply('setBrowserReturn',{type:'delete',success:false,info:err})
        // })
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
        // await registryInstaller.install().then(()=>{
        //     console.log('reg success')
        //     event.reply('setBrowserReturn',{type:'reg',success:true,info:'添加注册表成功'})
        //
        // }).catch((err)=>{
        //   console.log('reg error')
        //   console.log(err)
        //   event.reply('setBrowserReturn',{type:'reg',success:false,info:err})
        // })
      }
      app.setAsDefaultProtocolClient('http')
    }
  })
})
