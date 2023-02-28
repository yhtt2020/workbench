const {
  ipcRenderer
} = require('electron')
const ipc = ipcRenderer
const {contextBridge} =require('electron')
const api=require('./baseApi.js')
window.tsbApi=api
//载入api
try{
  contextBridge.exposeInMainWorld('tsbApi', api)
}catch (e) {
  console.warn(e)
}

//载入api
// ipc.on('changeUrl',(e,a)=>{
//   if(tsbApi.barrage.urlChangedCallback){
//     tsbApi.barrage.urlChangedCallback(a.url)
//     tsbApi.barrage.reload()
//   }
// })
