const path = eval('require')('path')
const fs = eval('require')('fs')
const {
  contextBridge, ipcRenderer
} = require('electron')
const ipc = ipcRenderer
require('../util/util').tools.getWindowArgs(window)
const BarrageModel=require('../model/barrageModel')
const barrageModel=new BarrageModel()
 barrageModel.init()

let apiUserInfo={}

const windowApi = {
  close: () => {
    ipc.send('closeBarrageWindow')
  }
}

const barrage={
  CONST:barrageModel.BARRAGE_CONST,
  urlChangedCallback:null,
  async add (data) {
    return await barrageModel.add(data)
  },
  async getList(channel,pageUrl){
    return await barrageModel.getList(channel,pageUrl)
  },
  onUrlChanged(callback){
    barrage.urlChangedCallback=callback
  },
  lock(){
    ipc.send('barrage.lock')
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
      barrageModel.init()
    })
    ipc.send('login')
  },

}
contextBridge.exposeInMainWorld('tsbApi', {
  path,
  fs,
  ipc: ipcRenderer,
  window:windowApi,
  user,
  barrage,
  tabs:{
    async current(){
      return await ipc.sendSync('tabs.current')
    }
  }
})

ipc.on('changeUrl',(e,a)=>{
  if(barrage.urlChangedCallback)
    barrage.urlChangedCallback(a.url)
})
