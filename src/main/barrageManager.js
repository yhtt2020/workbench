const { BrowserWindow, app, ipcMain } = require('electron')
let win = null
const ipc = ipcMain
const isDevelopmentMode = process.argv.some(arg => arg === '--development-mode')

const name = 'barrage'
const settingName = 'barrageOpen'

class BarrageManager {
  container
  instance
  isLocked = false

  constructor () {
  }

  async init () {
    if (settings.get(settingName)) {
      //是自动打开弹幕的
      let instance = await this.get()
      instance.window.show()
      instance.window.focus()
    }
  }

  /**
   * 关闭并移除设置，不影响锁定设置
   */
  close () {
    this.instance = null
    this.container = null
    windowManager.close(name)
    settings.set(settingName, false)
  }

  /**
   * 如果已经打开，则返回已经打开的窗体实例，否则则启动并返回窗体实例
   * @returns {Promise<*>}
   */
  async get () {
    let windowInstance
    let window
    if (!windowManager.isAlive(name)) {
      windowInstance = await windowManager.create({
        url: this.getUrl('barrage.html#/pop'),
        name: name,
        defaultBounds: {
          width: 950,
          height: 300
        },
        webPreferences: {
          preload: (__dirname + '/../preload/barragePreload.js'),
          additionalArguments: [
            '--user-data-path=' + app.getPath('userData'),
            '--app-version=' + app.getVersion(),
            '--app-name=' + app.getName(),
            ...((isDevelopmentMode ? ['--development-mode'] : [])),
          ],
          sandbox: false
        },
        rememberBounds: true,
        windowOption: {
          minHeight: 200,
          minWidth: 600,
          fullscreenable: false,
          transparent: true,
          backgroundColor: '#00000000',
          alwaysOnTop: true,
          hasShadow: false,
          frame: false,
          acceptFirstMouse: false
        }
      })
      window = windowInstance.window
      this.container = window
      this.instance = windowInstance
      settings.set(settingName, true)
      if (settings.get('barrageLock')) {
        this.lock()
      } else {
        this.unlock()
      }
    } else {
      windowInstance = windowManager.get(name)
    }
    return windowInstance
  }

  send (channel, args) {
    if (BarrageManager.isAlive()) {
      this.container.webContents.send(channel, args)
    }
  }

  /**
   *
   * @param url
   */
  changeUrl (url) {
    if (BarrageManager.isAlive()) {
      this.send('changeUrl', { url: url })
    }
  }

  static isAlive () {
    return windowManager.isAlive(name)
  }

  getInitBounds (parent) {
    const width = 950
    const height = 300
    let parentBounds = parent.getBounds()
    let x = parseInt(parentBounds.x + (parentBounds.width - width) / 2)
    let y = parseInt(parentBounds.y + 500)
    return { x, y, width: width, height: height }

  }

  getUrl (url) {
    let protocolUrl
    let dev = isDevelopmentMode  //调试开关
    protocolUrl = `tsbapp://./${url}` //todo 需要验证正式环境的协议情况
    if (dev) {
      protocolUrl = `http://localhost:1600/${url}`
    }
    return protocolUrl
  }

  lock () {
    if (BarrageManager.isAlive()) {
      this.container.setIgnoreMouseEvents(true, { forward: false })
      this.container.blur()
      this.isLocked = true
      settings.set('barrageLock', true)
      this.container.webContents.executeJavaScript(`document.body.classList.remove('active')`)
      this.container.setSkipTaskbar(true)
    }
  }

  unlock () {
    if (BarrageManager.isAlive()) {
      this.container.setIgnoreMouseEvents(false)
      this.isLocked = false
      this.container.setSkipTaskbar(false)
      this.container.webContents.executeJavaScript(`document.body.classList.add('active');window.$message.success('已为您解锁弹幕窗口')`)
      settings.set('barrageLock', false)
    }
  }

  destroy () {
    this.instance.close()
  }
}

module.exports = { BarrageManager }
