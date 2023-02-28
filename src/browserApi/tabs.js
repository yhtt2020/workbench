const {
  ipcRenderer
} = require('electron')
const ipc = ipcRenderer
const ipcHelper=require('./ipcHelper')
function send(channel,args={}){
  ipcHelper.send('window',channel,args)
}
const tabs={
  onUrlChanged:null,
  async current(){
    return await ipc.sendSync('tabs.current')
  },
  setOnUrlChanged(callback){
    tabs.onUrlChanged=callback
    console.log('设置监听')
    return ipcHelper.send('tabs','setOnUrlChanged')
  }
}
ipc.on('tabs.onUrlChanged',(e,a)=>{
  if(tabs.onUrlChanged){
    tabs.onUrlChanged(a)
  }
})
module.exports=tabs
