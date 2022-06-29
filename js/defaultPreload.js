const { injectBrowserAction } = require('electron-chrome-extensions/dist/browser-action.js')
const ipc=require('electron').ipcRenderer
// Inject <browser-action-list> element into WebUI
window.actionListEl=null
ipc.on('setActionListTab',(event,args)=>{
  window.actionListEl.setAttribute('tab',args.id)
})
ipc.on('setActionListPartition',(event,args)=>{
  window.actionListEl.setAttribute('partition',args.partition)
})
ipc.on('loadedExtensions',()=>{
  injectBrowserAction()
  window.actionListEl=document.getElementById('actions')
})
