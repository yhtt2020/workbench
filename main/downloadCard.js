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
    // downloadWindow.on('close', (e) => {
    //     e.preventDefault();
    //     downloadWindow.hide();
    // });

    downloadWindow.webContents.loadURL('file://' + __dirname + '/pages/download/index.html')
  } else {
    downloadWindow.close()
    downloadWindow = null
  }
}

app.whenReady().then(() => {

  ipc.on('openDownload', () => {
    createDownloadWin()
  })

})

ipc.on('show-context-menuing', (event,args) => {
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


ipc.on('show-context-menudone', (event) => {
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
