const {
  ipcRenderer
} = require('electron')
const ipc = ipcRenderer
const {contextBridge} =require('electron')
const api=require('./baseApi.js')
//载入api
try{
  window.tsbApi=api
  contextBridge.exposeInMainWorld('tsbApi', api)
}catch (e) {
  console.warn('content isolate')
}

//载入api
ipc.on('changeUrl',(e,a)=>{
  if(api.barrage.urlChangedCallback){
    api.barrage.urlChangedCallback(a.url)
    api.barrage.reload()
  }
})
