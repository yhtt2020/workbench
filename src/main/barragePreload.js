const path = eval('require')('path')
const fs = eval('require')('fs')
const {
  contextBridge, ipcRenderer
} = require('electron')
const ipc = ipcRenderer
require('../util/util').tools.getWindowArgs(window)
const BarrageModel=require('../model/barrageModel')
console.log(window.globalArgs)
const barrageModel=new BarrageModel()
 barrageModel.init()

let apiUserInfo={}

const windowApi = {
  close: () => {
    ipc.send('closeBarrageWindow')
  }
}

const barrage={
  async add (data) {
    return await barrageModel.add(data)
  }

}

const user={
  get:async () => {
    let userInfo = await ipc.invoke('user.get')
    return userInfo
  },
  login:(callback)=>{
    ipc.once('loginCallback',(event,args)=>{
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
  window:windowApi,
  user,
  barrage
})
