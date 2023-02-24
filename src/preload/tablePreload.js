
window.tsbApi=require('../browserApi/baseApi')
let ipc=require('electron').ipcRenderer
ipc.on('updateMusicStatus',(e,a)=>{
  console.log('音乐状态更新')
  if(window.updateMusicStatusHandler){
    window.updateMusicStatusHandler(a)
  }
})
