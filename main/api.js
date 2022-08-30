require('electron').app.whenReady().then(()=>{
  ipc.handle('user.get',async (event) => {
    let user = await userModel.getCurrent()
    return user
  })


})
