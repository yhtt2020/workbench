


app.whenReady().then(()=> {
  // ipc.on('openPage', (event, args) => {
  //   mainWindow.webContents.send('addTab', {url: args})
  // })
  let appId
  let tips
  ipc.on('installSuccess',(event,args)=>{
    appId = args.id
    tips = args.tips
  })
  ipc.on('installErr',(event,args)=>{
    appId = args.id
    tips = args.tips
  })

  ipc.on('addNewApp',function (event, args){
    SidePanel.send('addApp',args)
    if(tips === true){
      event.reply('installResult',true)
    }
    if(tips === false){
      event.reply('installResult',false)
    }
  })

  ipc.on('openSystemApp',(event,args)=>{
    SidePanel.send('openSystemApp',args)
  })

  let result
  ipc.on('result',(event,args)=>{
    result=args
  })

  ipc.on('contrast',function(event,args){
    SidePanel.send('contrast',args)

    setTimeout(()=>{
      event.reply('result',result)
    },150)
  })


  let openAppList
  ipc.on('openAppList',(event,args)=>{
    openAppList = args
  })

  ipc.on('needOpenApp',function(event,args){
    SidePanel.send('openApp')

    setTimeout(()=>{
      event.reply('openAppList',openAppList)
    },10)
  })

})

