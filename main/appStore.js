


app.whenReady().then(()=> {

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

    const myVar = setInterval(function () {
      if (tips !== '') {

        if(tips === true){
          event.reply('installResult',true)
        }
        if(tips === false){
          event.reply('installResult',false)
        }
        clearInterval(myVar)
      }
    }, 20);
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
    const myVar = setInterval(function () {
      if (result !== undefined) {
        event.reply('result', result)
        clearInterval(myVar)
      }
    }, 20);
  })


  let openAppList
  ipc.on('openAppList',(event,args)=>{
    openAppList = args
  })

  ipc.on('needOpenApp',function(event,args){
    SidePanel.send('openApp')
    const myVar = setInterval(function () {
      if (openAppList !== undefined) {
        event.reply('openAppList',openAppList)
        clearInterval(myVar)
      }
    }, 20);
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
})

