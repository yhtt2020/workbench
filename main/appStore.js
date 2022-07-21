
app.whenReady().then(()=>{
  ipc.on('openPage',(event,args)=>{
    mainWindow.webContents.send('addTab',{ url: args })
  })


})
