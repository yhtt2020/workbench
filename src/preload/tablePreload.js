const messageModel = require('../model/messageModel')
const api = require('../browserApi/baseApi')
window.tsbApi=require('../browserApi/baseApi')
window.tableApi=require('../tableApi/baseApi')
const groupApi=require('../api/groupApi')
let ipc=require('electron').ipcRenderer
ipc.on('updateMusicStatus',(e,a)=>{
  if(window.updateMusicStatusHandler){
    window.updateMusicStatusHandler(a)
  }
})
window.loudness=require('loudness')
window.iconv=require('iconv-lite')
window.brightness=require('brightness')
window.readAida64=require('aida64-to-json')
window.fs=require('fs-extra')
window.$models = {
  appModel:require('../model/appModel'),
  messageModel
}
window.$models.appModel.initDb()
window.$apis={
  groupApi
}
tsbApi.barrage.setOnUrlChanged((a)=>{
  if(tsbApi.barrage.urlChangedCallback){
    tsbApi.barrage.urlChangedCallback(a.url)
    tsbApi.barrage.reload()
  }
})
