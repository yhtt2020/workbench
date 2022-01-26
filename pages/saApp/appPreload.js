let {ipcRenderer} =require('electron')
const remote=require('@electron/remote')
let FindInPage= require('electron-find').FindInPage


//todo 为了引入findin，关闭了sandbox，可能存在安全隐患
ipcRenderer.on('findInPage',()=>{
  let findInPage=new FindInPage(remote.getCurrentWebContents())
  findInPage.openFindWindow()
})
