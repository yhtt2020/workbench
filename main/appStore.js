


app.whenReady().then(()=> {
  // ipc.on('openPage', (event, args) => {
  //   mainWindow.webContents.send('addTab', {url: args})
  // })
  //
  //
  ipc.on('addNewApp', (event, args) => {
    SidePanel.send('addApp',args)
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

    // setTimeout(()=>{
    //   event.reply('retrunResult',result)
    // },10)
    setTimeout(()=>{
      event.reply('contrast',result)
    },10)
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

