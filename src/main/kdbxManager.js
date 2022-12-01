const dialog=require('electron').dialog
const {app,ipcMain: ipc}=require('electron')
app.whenReady().then(()=>{
  ipc.on('selectKdbx',(event,args)=>{
    event.returnValue=dialog.showSaveDialogSync({
      title:'选择保存位置',
      defaultPath:(args.name?args.name:'') +'.kdbx',
      properties:[
        'createDirectory','showOverwriteConfirmation'
      ]
    })
  })
})
class KdbxManager {

}
module.exports=KdbxManager
