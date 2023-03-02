const messageModel = require('../model/messageModel')
const api = require('../browserApi/baseApi')
window.tsbApi=require('../browserApi/baseApi')
const groupApi=require('../api/groupApi')
let ipc=require('electron').ipcRenderer
ipc.on('updateMusicStatus',(e,a)=>{
  if(window.updateMusicStatusHandler){
    window.updateMusicStatusHandler(a)
  }
})
window.$models = {
  messageModel
}
window.$apis={
  groupApi
}
tsbApi.barrage.setOnUrlChanged((a)=>{
  if(tsbApi.barrage.urlChangedCallback){
    tsbApi.barrage.urlChangedCallback(a.url)
    tsbApi.barrage.reload()
  }
})
