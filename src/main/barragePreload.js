const path = eval('require')('path')
const fs = eval('require')('fs')
const {
  contextBridge, ipcRenderer
} = require('electron')
const ipc = ipcRenderer
let apiUserInfo={}
const window = {
  close: () => {
    ipc.send('closeBarrageWindow')
    console.log('发送closeBarrageWindow')
  }
}
const user={
  get:async () => {
    let userInfo = await ipc.invoke('user.get')
    return userInfo
  },
  login:(callback)=>{
    ipc.once('loginCallback',(event,args)=>{
      console.log(args)
      apiUserInfo=args.data
      callback(args.data.userInfo)
    })
    ipc.send('login')
  }
}
contextBridge.exposeInMainWorld('tsbApi', {
  path,
  fs,
  ipc: ipcRenderer,
  window,
  user
})
