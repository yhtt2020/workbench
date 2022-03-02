let downloadWindow = null

function createDownloadWin () {
  if (downloadWindow === null) {
    downloadWindow = new BrowserWindow({
      frame: true,
      width: 390,
      height: 465,
      resizable: false,
      parent: mainWindow,
      acceptFirstMouse: true,
      maximizable: false,
      alwaysOnTop: true,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      }
    })

    var parent_x = mainWindow.getPosition()[0]
    var parent_y = mainWindow.getPosition()[1]
    var parent_size_x = mainWindow.getSize()[0]
    var parent_size_y = mainWindow.getSize()[1]
    var siteCardWindow_size_x = siteCardWindow.getSize()[0]
    var siteCardWindow_size_y = siteCardWindow.getSize()[1]
    var siteCardWindows_new_x = parent_x + (parent_size_x - siteCardWindow_size_x) / 2
    var siteCardWindow_new_y = parent_y + (parent_size_y - siteCardWindow_size_y) / 2
    siteCardWindow.setPosition(parseInt(siteCardWindows_new_x), parseInt(siteCardWindow_new_y), false)


    downloadWindow.on('close', () => downloadWindow = null)
    downloadWindow.on('show', () => {
      downloadWindow.focus()
    })
    downloadWindow.webContents.loadURL('file://' + __dirname + '/pages/download/index.html')
  } else {
    userScriptWindow.close()
    userScriptWindow = null
  }
}


app.whenReady().then(() => {

  ipc.on('openDownload', () => {
    createDownloadWin()
  })

})


let {ipcMain} = require('electron')
ipcMain.on('show-context-menuing', (event,args) => {
  console.log(args)
  const template = [
    {
      label: ( args === true) ? '继续下载' : '暂停下载',
      click: () => { event.sender.send('context-menuing-start') }
    },

    { label: '分享'},

    { label: '复制下载链接' ,
      click: () => { event.sender.send('context-menuing-Url') }
    },

    { label: '删除任务',
      click: () => { event.sender.send('context-menuing-delete') }
    }
  ]

  const menu = Menu.buildFromTemplate(template)
  menu.popup(BrowserWindow.fromWebContents(event.sender))
})


ipcMain.on('show-context-menudone', (event) => {
  const template = [
    {
      label: '打开',
      click: () => { event.sender.send('context-menudone-open')}
    },

    { label: '打开文件夹',
      click: () => { event.sender.send('context-menudone-openpath')}
    },
    { label: '打开下载页',

      click: () => { event.sender.send('context-menudone-downloadUrl')}
    },
    { label: '复制下载链接',

      click: () => { event.sender.send('context-menudone-Url')}
    },

    { label: '删除',
      click: () => { event.sender.send('context-menudone-delete')}
    }
  ]
  const menu = Menu.buildFromTemplate(template)
  menu.popup(BrowserWindow.fromWebContents(event.sender))
})
