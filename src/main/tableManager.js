global.tableWin = null
let { app ,ipcMain:ipc} = require('electron')

class TableManager {

  async init () {
    if (global.tableWin === null) {
      tableWin = await windowManager.create({
        windowOption: {
          alwaysOnTop: true,
          width: 960,
          height: 540,
          frame: false,
          backgroundColor: '#fff',

        },
        webPreferences: {
          webSecurity :false,
          devTools: true,
          preload: require('path').join(__dirname, '../../src/preload/tablePreload.js'),
          nodeIntegration: true,
          sandbox:false,
          contextIsolation: false,
          additionalArguments: [
            '--user-data-path=' + userDataPath,
            '--app-version=' + app.getVersion(),
            '--app-name=' + app.getName(),
            ...((isDevelopmentMode ? ['--development-mode'] : []))
          ]
        }
      })
      tableWin.window.webContents.session.webRequest.onHeadersReceived({urls:['*://*/*']},(d,c)=>{
        if(d.responseHeaders['X-Frame-Options']){
          delete d.responseHeaders['X-Frame-Options']
        }else if(d.responseHeaders['x-frame-options']){
          delete d.responseHeaders['x-frame-options']
        }
        c({cancel:false,responseHeaders:d.responseHeaders})
      })
      tableWin.window.webContents.loadURL(render.getUrl('table.html'))
      tableWin.window.on('close', () => globalSearch = null)

    } else {
      if (tableWin.window.isFocused()) {
        tableWin.window.hide()
      } else {
        tableWin.window.show()
        tableWin.window.focus()
      }
    }
  }
}

app.whenReady().then(()=>{
  let transWin=null
  ipc.on('transFile',async () => {
    if (transWin === null) {
      tansWin = await windowManager.create({
        windowOption: {
          alwaysOnTop: true,
          width: 960,
          height: 540,
          frame: false,
          backgroundColor: '#fff',

        },
        webPreferences: {
          additionalArguments: [
            '--user-data-path=' + userDataPath,
            '--app-version=' + app.getVersion(),
            '--app-name=' + app.getName(),
            ...((isDevelopmentMode ? ['--development-mode'] : []))
          ]
        }
      })
      let webContents= tansWin.window.webContents
      webContents.loadURL('https://szfilehelper.weixin.qq.com/')
      webContents.on('dom-ready',()=>{
        webContents.insertCSS
      })
    }else{
      if (tansWin.window.isFocused()) {
        tansWin.window.hide()
      } else {
        tansWin.window.show()
        tansWin.window.focus()
      }
    }


  })
})

module.exports = TableManager
