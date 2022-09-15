const {
  ipcRenderer
} = require('electron')
const ipc = ipcRenderer
const {contextBridge} =require('electron')
const api=require('../browserApi/baseApi.js')
//载入api
contextBridge.exposeInMainWorld('tsbApi', api)
//载入api
ipc.on('changeUrl',(e,a)=>{
  if(api.barrage.urlChangedCallback){
    api.barrage.urlChangedCallback(a.url)
    api.barrage.reload()
  }
})
