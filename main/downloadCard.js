
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
      // disableDialogs:true,
      resizable: false,
      autoHideMenuBar: true,
      show: false,
      acceptFirstMouse: true,
      maximizable: false,
      alwaysOnTop: false,//调整窗口层级
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      }
    })
  let siteM = mainWindow.getBounds()
  let siteD = downloadWindow.getBounds()
  let Px = (siteM.x + siteM.width - siteD.width - 15)
  downloadWindow.setPosition(Px,siteM.y+90)

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
    downloadWindow.show()

  })

})

ipc.on('deleteFile',function (e,deletepath){
  const { shell } = require('electron')
  shell.trashItem(deletepath).then(() =>{
   return true
  })

})

ipc.on('willDownload',()=>{
  downloadWindow.show()
  downloadWindow.focus()
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


ipc.on('showMenuDone', (event) => {
  const template = [
    {
      label: '打开',
      click: () => { event.sender.send('menuDoneOpen')}
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

