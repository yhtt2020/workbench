

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

})

