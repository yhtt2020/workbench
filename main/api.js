require('electron').app.whenReady().then(() => {
  ipc.handle('user.get', async (event) => {
    const user = await userModel.getCurrent()
    return user
  })
})
