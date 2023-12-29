const { app, ipcMain: ipc } = require('electron')
const captureHelper = require('./captureHelper')

function sendToTable (event, args) {
  global.tableManager.send(event, args)
}

/**
 * 分屏管理器，此处的管理器不直接操作屏幕数据，而只存运行时
 */
class TableScreenManager {
  //运行中的屏幕
  runningScreens = {}

  /**
   * 获取分屏的url
   */
  getUrl () {

  }

  /**
   * 设置bounds设置项
   * @param window
   * @param key
   */
  saveBounds (window, key) {
    let tableWinSetting = {
      bounds: window.getBounds(),
      isMaximized: window.isMaximized()
    }
    settings.set('tableWinSetting_' + key, tableWinSetting)
  }

  /**
   * 获取到bounds的设置
   * @param key
   * @returns {*}
   */
  getBounds (key) {
    return settings.get('tableWinSetting_' + key)
  }

  /**
   * 绑定存储位置的事件组
   * @param window
   * @param key
   */
  bindSaveBoundsEvent (window, key) {
    window.on('close', () => {
      this.saveBounds(window, key)
    })

    window.on('resized', () => {
      this.saveBounds(window, key)
    })

    window.on('enter-html-full-screen', () => {
      this.saveBounds(window, key)
    })

    window.on('leave-html-full-screen', () => {
      this.saveBounds(window, key)
    })

    window.on('blur', () => {
      this.saveBounds(window, key)
    })

    window.on('content-bounds-updated', () => {
      this.saveBounds(window, key)
    })

    window.on('session-end', () => {
      this.saveBounds(window, key)
    })

    window.on('moved', () => {
      this.saveBounds(window, key)
    })
    window.on('leave-full-screen', () => {
      this.saveBounds(window, key)
    })
    window.on('enter-full-screen', () => {
      this.saveBounds(window, key)
    })
  }

  closeByDomain (domain) {
    let key = Object.keys(this.runningScreens).find(key => {
      return this.runningScreens[key].fullDomain === domain
    })
    let screen = this.runningScreens[key]
    if (screen) {
      screen.window.close()
      delete this.runningScreens[key]
    }
  }

  /**
   *
   * @param screen
   */
  async startupScreen (screen) {
    let key = screen.key
    if (this.runningScreens[key]) {
      const window = this.runningScreens[key].window
      if (window && !window.isDestroyed()) {
        window.focus()
      }
    } else {
      let windowInstance = await windowManager.create({
        name:screen.key+ '_table',
        windowOption: {
          alwaysOnTop: false,
          width: 1098,
          minimizable: false,
          height: 618,
          minWidth: 800,
          minHeight: 480,
          frame: false,
          skipTaskbar: screen.settings.skipTaskbar,//增加单独的设置项目
          transparent: true,
          show: true,
          //backgroundColor: '#fff',
        },
        webPreferences: {
          webSecurity: false,
          devTools: true,
          preload: require('path').join(__dirname, '../../src/preload/tablePreload.js'),
          nodeIntegration: true,
          sandbox: false,
          contextIsolation: false,
          additionalArguments: [
            '--app-path=' + app.getPath('exe'),
            '--app-dir_name=' + __dirname,
          ]
        }
      })
      let savedBounds = this.getBounds(screen.key)
      let window = windowInstance.window
      require("@electron/remote/main").enable(window.webContents)
      if (savedBounds) {
        window.setBounds(savedBounds.bounds)
        setTimeout(() => {
          if (savedBounds.isMaximized) {
            window.maximize()
          }
        }, 1000)
      }

      this.bindSaveBoundsEvent(window, screen.key)
      const url = render.getUrl('table.html', {}, screen.fullDomain)
      window.loadURL(url)
      window.webContents.on('did-finish-load', async () => {
        setTimeout(async () => {
          //延迟3秒再截图，保证不截取到载入界面
          if (!window.isDestroyed()) {
            //如果用户手速够快，还是有可能被关闭了的。
            let captureImg = await captureHelper.capture(window.webContents)
            if (captureImg) {
              sendToTable('updateCapture', { key: screen.key, image: captureImg })
            }
          }
          window.webContents.send('updateDetail', { detail: screen })
        }, 3000)

      })
      window.on('closed', () => {
        try {
          sendToTable('stoppedScreen', { screen: screen })
          delete this.runningScreens[screen.key]
        } catch (e) {
          console.warn(e)
        }
      })
      this.runningScreens[key] = {
        windowInstance: windowInstance,
        window: window,
        screen: screen,
        domain: screen.domain,
        fullDomain: screen.fullDomain
      }
    }

  }

  /**
   * 关闭某个分屏
   * @param screen
   */
  stopScreen (screen) {
    let runningScreen = this.runningScreens[screen.key]
    if (runningScreen) {
      if (!runningScreen.window.isDestroyed()) {
        runningScreen.window.close()
      }
    }
  }

  bindIPC () {
    ipc.on('startupScreen', async (event, args) => {
      await this.startupScreen(args.screen)
    })

    ipc.on('stopScreen', async (event, args) => {
      await this.stopScreen(args.screen)
    })

    ipc.on('closeScreen', (event, args) => {
      let fullDomain = args.fullDomain
      this.closeByDomain(fullDomain)
      sendToTable('closeScreen')
    })

    ipc.on('sendToSubs', (event, argsOrigin) => {
      const {
        channel, args
      } = argsOrigin
      Object.keys(this.runningScreens).forEach(sub => {
        this.runningScreens[sub].window.webContents.send(channel, args)
      })
    })
    ipc.on('sendToSub', (event, argsOrigin) => {
      const {
        key, channel, args
      } = argsOrigin
      Object.keys(this.runningScreens).forEach(sub => {
        if (this.runningScreens[sub].screen.key === key) {
          this.runningScreens[sub].window.webContents.send(channel, args)
        }
      })
    })
  }
}

module.exports = TableScreenManager
