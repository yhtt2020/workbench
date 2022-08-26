const windowApi = {
  close: () => {
    ipc.send('closeBarrageWindow')
  }
}
module.exports=windowApi
