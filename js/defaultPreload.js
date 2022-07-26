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
  setTimeout(()=>{
    updateHideExtensions()
  },1000)
})
ipc.on('hideExtension',(event,args)=>{
  updateHideExtensions()
})
function updateHideExtensions(){
  ipc.invoke('getHideExtensions').then(data=>{
    let childNodes= document.querySelector("#actions").shadowRoot.childNodes
    childNodes.forEach(node=>{
      let hide= data.some(hideExt=>{
        return node.id===hideExt
      })
      node.hidden=hide
    })

    document.getElementById('actions').hidden=false
  })
}
ipc.on('showExtension',(event,args)=>{
  updateHideExtensions()
})

ipc.on('removeExtension',(event,args)=>{
  document.querySelector("#actions").shadowRoot.getElementById(args.id).remove()
})
