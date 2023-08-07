const { app } = require('electron')

class ToolboxManager {
  windowInstance = null//窗口实例
  static ensure () {
    if (!global.toolboxManager) {
      global.toolboxManager = new ToolboxManager()
    }
  }

  async open () {
    if (!this.windowInstance) {
      this.windowInstance = await global.windowManager.create({
        name: 'toolbox',
        url: global.render.getUrl('toolbox.html'),
        windowOption: {
          frame: false,
          width: 572,
          height: 420,
        },
        webPreferences: {
          nodeIntegration: true,
          webSecurity: false,
          preload: require('path').join(__dirname, '../../src/preload/toolboxPreload.js'),
          sandbox: false,
          contextIsolation: false,
          enableBlinkFeatures: ['unsafely-treat-insecure-origin-as-secure'],
          additionalArguments: [
            '--app-path=' + app.getPath('exe'),
            '--app-dir_name=' + __dirname,
          ]
        }
      })
      const window = this.windowInstance.window
      //window.webContents.openDevTools()//打开调试工具，注释此行，禁止直接打开调试工具

      window.webContents.on('before-input-event', (event, input) => {
        //增加f12调试工具，且支持打开f12的时候自动屏蔽失去焦点隐藏
        if (input.key.toLowerCase() === 'f12') {
          window.webContents.openDevTools({
            mode: 'detach'
          })
          event.preventDefault()
        }
      })
      window.on('blur',()=>{
        if(!window.webContents.isDevToolsOpened()){
          this.windowInstance.close() //注释此行禁止失焦隐藏
          this.windowInstance=null
        }
      })
      window.on('closed', () => {
        this.windowInstance = null
      })
    } else {
      this.windowInstance.window.focus()
    }
  }

   alive () {
    if (this.windowInstance) {
      if (this.windowInstance.window) {
        if (!this.windowInstance.window.isDestroyed()) {
          return true
        }
      }
    }
    return false
  }

   close () {
    if (this.windowInstance) {
      if (this.windowInstance.window) {
        if (!this.windowInstance.window.isDestroyed()) {
          this.windowInstance.close()
          this.windowInstance = null
        }
      }
    }
  }

  async toggle () {
    if(this.alive()){
      this.close()
    }else{
      await this.open()
    }
  }
}

module.exports = ToolboxManager
