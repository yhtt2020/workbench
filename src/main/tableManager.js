global.tableWin = null
let { app, ipcMain: ipc, Notification, session } = require('electron')
const path = require('path')
const fs = require('fs')
const TableScreenManager = require('./tableScreenManager')
const ScreenCaptureManager = require('./screenCaptureManager')
const { getDeskFiles } = require('./libs/systemHelper')
const SystemHelper = require('./libs/systemHelper')
//测试
const screenCaptureManager = new ScreenCaptureManager()

ipc.on('recoverSuccess', () => {
  new Notification({
    title: '数据迁移成功',
    body: '数据迁移成功，您可正常使用。'
  }).show()
})

/**
 * C:\Windows\System32\drivers\etc
 *
 * #工作台开发环境补充
 * 127.0.0.1 table.com
 * 127.0.0.1 1.table.com
 * 127.0.0.1 2.table.com
 * 127.0.0.1 3.table.com
 * 127.0.0.1 4.table.com
 * 127.0.0.1 5.table.com
 * 127.0.0.1 6.table.com
 * 127.0.0.1 7.table.com
 * #工作台开发环境end
 */

class TableManager {
  window //主屏的窗体
  windows //分屏的窗体
  storage //临时存储

  tableScreenManager

  static alive () {
    return global.tableWin && !global.tableWin.window.isDestroyed()
  }

  async init () {

    if (global.tableWin === null) {
      let tableWinSetting = settings.get('tableWinSetting')
      let showInTaskbar = settings.get('showInTaskBar')
      if (showInTaskbar === undefined) {
        showInTaskbar = true
      }
      global.tableWin = {}//因为启动需要时间，如果不先设置一个变量，容易导致重复启动。
      global.tableWin = await windowManager.create({
        name: 'table',
        windowOption: {
          acceptFirstMouse:true,
          alwaysOnTop: false,
          width: 1098,
          minimizable: false,
          height: 618,
          minWidth: 800,
          minHeight: 480,
          frame: false,
          //focusable:false, //辅助模式，无法被聚焦
          skipTaskbar: !showInTaskbar,
          transparent: true,
          //backgroundColor: '#fff',
        },
        webPreferences: {
          webSecurity: false,
          devTools: true,
          preload: require('path').join(__dirname, '../../src/preload/tablePreload.js'),
          nodeIntegration: true,
          enableBlinkFeatures: ['unsafely-treat-insecure-origin-as-secure'],
          sandbox: false,
          contextIsolation: false,
          additionalArguments: [
            '--app-path=' + app.getPath('exe'),
            '--app-dir_name=' + __dirname,
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
        setTimeout(() => {
          if (tableWinSetting.isMaximized) {
            this.window.maximize()
          }
        }, 1000)
      }
      // tableWin.window.webContents.on('select-bluetooth-device',(event, deviceList, callback)=>{
      //   event.preventDefault();
      //   console.log('Device list:', deviceList);
      //   let result = deviceList[0];
      //   if (!result) {
      //     callback('');
      //   } else {
      //     callback(result.deviceId);
      //   }
      // })
      tableWin.window.webContents.loadURL(render.getUrl('table.html', {}, 'table.com'))
      tableWin.window.webContents.session.setPermissionRequestHandler((webContents, permission, callback) => {
        let allowedPermissions = ['audioCapture', 'media', 'fullscreen'] // Full list here: https://developer.chrome.com/extensions/declare_permissions#manifest

        if (allowedPermissions.includes(permission)) {
          callback(true) // Approve permission request
        } else {
          console.error(
            `The application tried to request permission for '${permission}'. This permission was not whitelisted and has been blocked.`
          )

          callback(false) // Deny
        }
      })

      tableWin.window.on('close', () => {
        this.saveBounds()
        global.tableWin = null
      })

      tableWin.window.on('resized', () => {
        this.saveBounds()
      })

      tableWin.window.on('enter-html-full-screen', () => {
        this.saveBounds()
      })

      tableWin.window.on('leave-html-full-screen', () => {
        this.saveBounds()
      })

      tableWin.window.on('blur', () => {
        this.saveBounds()
      })

      tableWin.window.webContents.on('content-bounds-updated', () => {
        this.saveBounds()
      })

      tableWin.window.on('session-end', () => {
        this.saveBounds()
      })

      tableWin.window.on('moved', () => {
        this.saveBounds()
      })
      tableWin.window.on('leave-full-screen', () => {
        this.saveBounds()
      })
      tableWin.window.on('enter-full-screen', () => {
        this.saveBounds()
      })
      tableWin.window.on('ready-to-show', () => {
        tableWin.window.show()
        tableWin.window.focus()
      })

    } else {
      if (tableWin.window) {
        if (tableWin.window.isFocused()) {
          tableWin.window.hide()
        } else {
          tableWin.window.show()
          tableWin.window.focus()
        }
      }
    }
    if (!this.tableScreenManager) {
      this.tableScreenManager = new TableScreenManager()
      this.tableScreenManager.bindIPC()
    }
    global.tableAppManager.setTableWin(tableWin.window)
    global.tableTabManager.setTableWin(tableWin.window)

     this.ensureDeskIcons().then()
  }

  /**
   * 确认并获取桌面图标
   */
  async ensureDeskIcons(){
    const fs=require('fs-extra')
    let savePath = path.join(app.getPath('userData'), 'icons')
    if(!fs.existsSync(savePath)){
      //取一次桌面的icons
      fs.ensureDirSync(savePath)
      let files=await SystemHelper.getDeskFiles(false)
      files.forEach(file=>{
        SystemHelper.extractFileIcon(file.path)
      })
    }

  }
  saveBounds () {
    let tableWinSetting = {
      bounds: this.window.getBounds(),
      isMaximized: this.window.isMaximized()
    }
    settings.set('tableWinSetting', tableWinSetting)
  }

  close () {
    this.saveBounds()
    global.tableAppManager.closeAllApp()
    global.tableWin.window.close()
    global.tableWin = null
  }

  send (channel, args) {
    if (global.tableWin && !global.tableWin.window.isDestroyed()) {
      tableManager.window.webContents.send(channel, args)
    }
  }
}

app.whenReady().then(() => {
  let transWin = null

  settings.listen('showInTaskBar', (value) => {
    //监听showInTaskBar
    if (TableManager.alive()) {
      global.tableWin.window.setSkipTaskbar(!value)
    }
  })

  ipc.on('openDevTool',async()=>{
    if (TableManager.alive()) {
      global.tableWin.window.webContents.openDevTools()
    }
  })

  ipc.on('transFile', async () => {
    if (transWin === null) {
      tansWin = await windowManager.create({
        windowOption: {
          alwaysOnTop: true,
          width: 960,
          height: 540,
          frame: false,
          backgroundColor: '#fff',

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
        let title = path.basename(file)
        if (file.endsWith('.lnk')) {
          link = require('electron').shell.readShortcutLink(file)
        }
        let icon =''
        try{
          icon=await app.getFileIcon(link ? link.target : file)
        }catch (e){
          icon ='/icons/winapp.png'
          console.log('获取图标失败')
        }

        result.push({
          name: path.parse(file).name,
          ext: path.parse(file).ext,
          path: link ? link.target : file,
          icon: icon.toDataURL(),
          title: title
        })

    }
    e.returnValue = result
  })

  ipc.on('getDeskApps', async (e) => {
    let apps = []
    apps=await getDeskFiles()
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

  ipc.on('getRecordSource', () => {
    screenCaptureManager.getSource().then(sources => {
      require('fs-extra').ensureDirSync(path.join(app.getPath('userData'), 'tmp'))
      let returnData = sources.map(s => {
        let file = path.join(app.getPath('userData'), 'tmp', 'capture_' + s.id.replaceAll(':', '_') + '.jpg')
        let icon = path.join(app.getPath('userData'), 'tmp', 'capture_' + s.id.replaceAll(':', '_') + '_icon.png')
        try {
          fs.writeFileSync(file, s.thumbnail.toJPEG(100))
          if (s.appIcon) {
            fs.writeFileSync(icon, s.appIcon.toPNG())
          }
        } catch (e) {
          console.warn('保存缩略图失败', e)
        }
        return {
          name: s.name,
          type: s.id.startsWith('screen') ? 'screen' : 'window',
          id: s.id,
          src: file,
          icon: icon
        }
      })
      global.tableManager.send('gotRecordSource', {
        sources: returnData
      })
    }).catch((err) => {
      console.warn('获得录屏源失败', err)
    })
  })

  // ipc.on('captureImage',(event,args)=>{
  //   screenCaptureManager.getSource().then(sources => {
  //     sources.forEach(source=>{
  //       if(source.id===)
  //     })
  //   })
  // })
})

module.exports = TableManager
