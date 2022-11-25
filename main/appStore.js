


app.whenReady().then(()=> {

  ipc.on('openSystemApp',(event,args)=>{
    SidePanel.send('openSystemApp',args)
  })

  let result
  ipc.on('result',(event,args)=>{
    result=args
  })

  ipc.on('contrast',function(event,args){
    SidePanel.send('contrast',args)
    const myVar = setInterval(function () {
      if (result !== undefined) {
        event.reply('result', result)
        clearInterval(myVar)
      }
    }, 20);
  })


  let allAppList
  ipc.on('allAppList',(event,args)=>{
    allAppList = args
  })

  ipc.on('needOpenApp',function(event,args){
    SidePanel.send('openApp')
    // const myVar = setInterval(function () {
    //   if (allAppList !== undefined) {
    //     event.reply('openAppList',allAppList)
    //     clearInterval(myVar)
    //   }
    // }, 20);
    setTimeout(()=>{
      event.reply('openAppList',allAppList)
    },100)

  })


  ipc.on('openSet',(event,args)=>{
    SidePanel.send('openSet',args)
  })
  ipc.on('uninstallApp',(event,args)=>{
    SidePanel.send('uninstallApp',args)
  })

  let allMyApps
  ipc.on('allMyApps',(event,args)=>{
    allMyApps = args
  })
  ipc.on('myApps',function (event,args){
    SidePanel.send('myApps')
    const myVar = setInterval(function () {
      if (allMyApps !== '') {
        event.reply('allMyApps',allMyApps)
        clearInterval(myVar)
      }
    }, 20);
  })

  ipc.on('openAppCircle',(event,args)=>{
    SidePanel.send('openAppCircle',args)
  })

  ipc.on('openAppGroupChat',(event,args)=>{
    SidePanel.send('openAppGroupChat',args)
  })

  ipc.on('openInvite',(event,args)=>{

    SidePanel.send('openInvite',args)
  })

})

