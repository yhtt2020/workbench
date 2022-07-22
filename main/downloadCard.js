
let downloadWindow=null
function getDownloadWindow(){
  if(downloadWindow===null){
    createDownloadWin()
  }
  return downloadWindow
}


function createDownloadWin () {
    downloadWindow = new BrowserWindow({
      frame: true,
      width: 390,
      height: 465,
      sandbox:false,
      maxWidth:390,
      maxHeight:465,
      minWidth:390,
      // disableDialogs:true,
      // resizable: false,
      autoHideMenuBar: true,
      show: false,
      focusable:true,
      acceptFirstMouse: true,
      maximizable: false,
      alwaysOnTop: false,//调整窗口层级
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      }
    })

  downloadWindow.webContents.loadURL('file://' + __dirname + '/pages/download/index.html')


  downloadWindow.on('close',(event)=> {
    if (forceClose) {
      downloadWindow = null
    } else {
      downloadWindow.hide()
      event.preventDefault()
    }
  })


  setTimeout(()=>{
    if(mainWindow){
      mainWindow.on('close',()=>{
        forceClose=true
        if(downloadWindow && !downloadWindow.isDestroyed())
          downloadWindow.close()
        downloadWindow=null
      })
    }

  },2000)
}

app.whenReady().then(() => {
  ipc.on('openDownload', (event,args) => {
    getDownloadWindow()
    if(mainWindow!=null && !mainWindow.isDestroyed()){
      let x = (mainWindow.getBounds().x + mainWindow.getBounds().width - downloadWindow.getBounds().width - 15)
      downloadWindow.setPosition(x,mainWindow.getBounds().y+90)
    }
    downloadWindow.show()
  })
})

ipc.on('deleteFile',function (e,deletepath){
  const { shell } = require('electron')
  shell.trashItem(deletepath).then(() =>{
   return true
  })
})

// ipc.on('originalPage',(args)=>{
//   let originalPageUrl = args
// })
//
// ipc.on('addOriginal',()=>{
//   ipc.send('addTab',{url:originalPageUrl})
// })

ipc.on('willDownload',()=>{
  getDownloadWindow()
  if(mainWindow!=null && !mainWindow.isDestroyed()){
    let x = (mainWindow.getBounds().x + mainWindow.getBounds().width - downloadWindow.getBounds().width - 15)
    downloadWindow.setPosition(x,mainWindow.getBounds().y+90)
  }
  downloadWindow.focus()
  downloadWindow.show()

})



ipc.on('showMenuIng', (event,args) => {
  const template = [
    {
      label: ( args === true) ? '继续下载' : '暂停下载',
      click: () => { event.sender.send('menuIngStart') }
    },

    { label: '分享'},

    { label: '复制下载链接' ,
      click: () => { event.sender.send('menuIngUrl') }
    },

    { label: '删除任务',
      click: () => { event.sender.send('menuIngDelete') }
    }
  ]
  const menu = Menu.buildFromTemplate(template)
  menu.popup(BrowserWindow.fromWebContents(event.sender))
})


ipc.on('showMenuDone', (event,args) => {
  const template = [
    {
      label: '打开',
      click: () => { event.sender.send('menuDoneOpen',args)}
    },

    { label: '打开文件夹',
      click: () => { event.sender.send('menuDoneOpenPath')}
    },
    { label: '打开下载页',

      click: () => { event.sender.send('menuDoneOpenPage')}
    },
    { label: '复制下载链接',

      click: () => { event.sender.send('menuDoneUrl')}
    },

    { label: '删除',
      click: () => { event.sender.send('menuDoneDelete')}
    }
  ]
  const menu = Menu.buildFromTemplate(template)
  menu.popup(BrowserWindow.fromWebContents(event.sender))

})

ipc.on('showMenuTrash', (event) => {
  const template = [

    { label: '重新下载',
      click: () => { event.sender.send('menuTrashAgain')}
    },
    { label: '打开下载页',

      click: () => { event.sender.send('menuTrashOpenPage')}
    },
    { label: '复制下载链接',

      click: () => { event.sender.send('menuTrashUrl')}
    },

    { label: '删除记录',
      click: () => { event.sender.send('menuTrashDelete')}
    }
  ]
  const menu = Menu.buildFromTemplate(template)
  menu.popup(BrowserWindow.fromWebContents(event.sender))

})
