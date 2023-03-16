global.tableWin = null
let { app, ipcMain: ipc } = require('electron')
const path = require('path')

class TableManager {
  window

  async init () {
    if (global.tableWin === null) {
      let tableWinSetting = settings.get('tableWinSetting')
      global.tableWin = {}//因为启动需要时间，如果不先设置一个变量，容易导致重复启动。
      global.tableWin = await windowManager.create({
        name:'table',
        windowOption: {
          alwaysOnTop: false,
          width: 1098,
          minimizable: false,
          height: 618,
          minWidth: 1098,
          minHeight: 618,
          frame: false,
          backgroundColor: '#fff',
        },
        webPreferences: {
          webSecurity: false,
          devTools: true,
          preload: require('path').join(__dirname, '../../src/preload/tablePreload.js'),
          nodeIntegration: true,
          sandbox: false,
          contextIsolation: false,
          additionalArguments: [
            '--user-data-path=' + userDataPath,
            '--app-version=' + app.getVersion(),
            '--app-name=' + app.getName(),
            '--app-path='+app.getPath('exe'),
            ...((isDevelopmentMode ? ['--development-mode'] : []))
          ]
        }
      })
      tableWin.window.webContents.session.webRequest.onHeadersReceived({ urls: ['*://*/*'] }, (d, c) => {
        if (d.responseHeaders['X-Frame-Options']) {
          delete d.responseHeaders['X-Frame-Options']
        } else if (d.responseHeaders['x-frame-options']) {
          delete d.responseHeaders['x-frame-options']
        }
        c({ cancel: false, responseHeaders: d.responseHeaders })
      })
      this.window = tableWin.window
      if (tableWinSetting) {
        this.window.setBounds(tableWinSetting.bounds)
        if (tableWinSetting.isMaximized) {
          this.window.maximize()
        }
      }
      tableWin.window.webContents.loadURL(render.getUrl('table.html'))

      tableWin.window.on('close', () => {
        this.saveBounds()
        global.tableWin = null
      })

      tableWin.window.on('resized',()=>{
        this.saveBounds()
      })

      tableWin.window.on('moved',()=>{
        this.saveBounds()
      })
      tableWin.window.on('leave-full-screen',()=>{
        this.saveBounds()
      })
      tableWin.window.on('enter-full-screen',()=>{
        this.saveBounds()
      })

    } else {
      if (tableWin.window.isFocused()) {
        tableWin.window.hide()
      } else {
        tableWin.window.show()
        tableWin.window.focus()
      }
    }
    global.tableAppManager.setTableWin(tableWin.window)//更新tablewin
  }

  saveBounds(){
    let tableWinSetting = {
      bounds: this.window.getBounds(),
      isMaximized: this.window.isMaximized()
    }
    settings.set('tableWinSetting', tableWinSetting)
  }

  close () {
    global.tableAppManager.closeAllApp()
    global.tableWin.window.close()
  }

  send (channel, args) {
    if (global.tableWin && !global.tableWin.window.isDestroyed()) {
      tableManager.window.webContents.send(channel, args)
    }
  }
}

app.whenReady().then(() => {
  let transWin = null

  ipc.on('transFile', async () => {
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
      let webContents = tansWin.window.webContents
      webContents.loadURL('https://szfilehelper.weixin.qq.com/')
      webContents.on('dom-ready', () => {
        webContents.insertCSS
      })
    } else {
      if (tansWin.window.isFocused()) {
        tansWin.window.hide()
      } else {
        tansWin.window.show()
        tansWin.window.focus()
      }
    }

  })

  ipc.on('getFilesIcon', async (e, args) => {
    let files = args.files
    let result = []
    let path = require('path')
    for (let file of files) {
      let link = null
      if (file.endsWith('.lnk')) {
        link = require('electron').shell.readShortcutLink(file)
      }
      let icon = await app.getFileIcon(link ? link.target : file)
      result.push({
        name: path.parse(file).name,
        ext: path.parse(file).ext,
        path: link ? link.target : file,
        icon: icon.toDataURL()
      })
    }
    e.returnValue = result
  })

  ipc.on('getDeskApps', async (e) => {
    let apps = []
    let path = require('path')

    function getDesktopFiles (_dir) {
      const fs = require('fs')
      var filepaths = []
      //read directory
      let files = fs.readdirSync(_dir)
      files.forEach(_file => {
        //console.log(_file);
        let _p = _dir + '/' + _file
        //changes slashing for file paths
        let _path = _p.replace(/\\\\/g, '/')
        let name = path.parse(_path).name
        if (_path.endsWith('.lnk')) {
          _path = require('electron').shell.readShortcutLink(_path).target
        }
        filepaths.push({
          name: name,
          path: _path,
          ext: path.parse(_path).ext
        })
      })
      console.log(filepaths)
      return filepaths

    }

    let filepaths = getDesktopFiles(app.getPath('desktop'))

    for (let file of filepaths) {
      let icon = await app.getFileIcon(file.path)
      apps.push({
        name: file.name,
        ext: file.ext,
        path: file.path,
        icon: icon.toDataURL()
      })
    }
    e.returnValue = apps
  })

  ipc.on('updateMusicStatus', (event, args) => {
    global.tableManager.send('updateMusicStatus', args)
  })

  ipc.on('wyyAction', (event, args) => {
    global.tableAppManager.send('wyyMusic', 'wyyAction', args)
  })

  ipc.on('exitTable', () => {
    global.tableManager.close()
  })
})

module.exports = TableManager
