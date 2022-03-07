app.whenReady().then(()=>{
  ipc.on('getUserInfo',(event,args)=>{
    SidePanel.send('getUserInfo',{webContentsId:event.sender.id})
  })
})
