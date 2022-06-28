const { ElectronChromeExtensions } = require('electron-chrome-extensions')
const { buildChromeContextMenu } = require('electron-chrome-context-menu')
app.on('session-created', (session) => {
  if (session !== require('electron').session.defaultSession) {
    browser = new Browser(session)
    //this.init.bind(this)
  }else{
    console.log('没有初始化全部插件')
  }

})
class Browser {
  session = null

  constructor (session) {
    let app = require('electron').app
    this.session=session
    this.init()
    app.on('web-contents-created', this.onWebContentsCreated.bind(this))
  }

  initSession () {

  }

  async onWebContentsCreated (event, webContents) {
    webContents.on('context-menu', (event, params) => {
      const menu = buildChromeContextMenu({
        params,
        webContents,
        extensionMenuItems: this.extensions.getContextMenuItems(webContents, params),
        openLink: (url, disposition) => {
          const win = this.getFocusedWindow()

          switch (disposition) {
            case 'new-window':
              this.createWindow({ initialUrl: url })
              break
            default:
              const tab = win.tabs.create()
              tab.loadURL(url)
          }
        },
      })

      menu.popup()
    })
  }

  async init () {

    this.initSession()
    this.extensions = new ElectronChromeExtensions({
      session: this.session,

      createTab: (details) => {
        const win =
          typeof details.windowId === 'number' &&
          this.windows.find((w) => w.id === details.windowId)

        if (!win) {
          throw new Error(`Unable to find windowId=${details.windowId}`)
        }

        const tab = win.tabs.create()

        if (details.url) tab.loadURL(details.url || newTabUrl)
        if (typeof details.active === 'boolean' ? details.active : true) win.tabs.select(tab.id)

        return [tab.webContents, tab.window]
      },
      selectTab: (tab, browserWindow) => {
        const win = this.getWindowFromBrowserWindow(browserWindow)
        win?.tabs.select(tab.id)
      },
      removeTab: (tab, browserWindow) => {
        const win = this.getWindowFromBrowserWindow(browserWindow)
        win?.tabs.remove(tab.id)
      },

      createWindow: (details) => {
        const win = this.createWindow({
          initialUrl: details.url || newTabUrl,
        })
        // if (details.active) tabs.select(tab.id)
        return win.window
      },
      removeWindow: (browserWindow) => {
        const win = this.getWindowFromBrowserWindow(browserWindow)
        win?.destroy()
      },
    })
    const extensionPath = path.join(userDataPath, 'extensions')
    if (!fs.existsSync(extensionPath)) {
      fs.mkdirSync(extensionPath)
    }
    const installedExtensions = await loadExtensions(
      this.session, extensionPath
    )
  }
}

let browser

const manifestExists = async (dirPath) => {
  if (!dirPath) return false
  const manifestPath = path.join(dirPath, 'manifest.json')
  try {
    return (fs.statSync(manifestPath)).isFile()
  } catch {
    return false
  }
}

/**
 * 从目录读入全部的扩展
 * @param session
 * @param extensionsPath
 * @returns {Promise<[]>}
 */
async function loadExtensions (session, extensionsPath) {
  console.log('开始读入', extensionsPath)
  const subDirectories = await fs.readdirSync(extensionsPath, {
    withFileTypes: true,
  })

  const extensionDirectories = await Promise.all(
    subDirectories
      .filter((dirEnt) => dirEnt.isDirectory())
      .map(async (dirEnt) => {
        const extPath = path.join(extensionsPath, dirEnt.name)

        if (await manifestExists(extPath)) {
          return extPath
        }

        const extSubDirs = await fs.readdirSync(extPath, {
          withFileTypes: true,
        })

        const versionDirPath =
          extSubDirs.length === 1 && extSubDirs[0].isDirectory()
            ? path.join(extPath, extSubDirs[0].name)
            : null

        if (await manifestExists(versionDirPath)) {
          return versionDirPath
        }
      })
  )
  const results = []

  for (const extPath of extensionDirectories.filter(Boolean)) {
    try {
      const extensionInfo = await session.loadExtension(extPath)
      results.push(extensionInfo)
    } catch (e) {
      console.error(e)
    }
  }

  return results
}

const getParentWindowOfTab = (tab) => {
  switch (tab.getType()) {
    case 'window':
      return BrowserWindow.fromWebContents(tab)
    case 'browserView':
    case 'webview':
      return tab.getOwnerBrowserWindow()
    case 'backgroundPage':
      return BrowserWindow.getFocusedWindow()
    default:
      throw new Error(`Unable to find parent window of '${tab.getType()}'`)
  }
}


