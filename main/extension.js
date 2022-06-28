const { ElectronChromeExtensions } = require('electron-chrome-extensions')
const manifestExists = async (dirPath) => {
  if (!dirPath) return false
  const manifestPath = path.join(dirPath, 'manifest.json')
  try {
    return ( fs.statSync(manifestPath)).isFile()
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
async function loadExtensions(session, extensionsPath) {
  console.log('开始读入',extensionsPath)
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
      let session=require('electron').session.defaultSession
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

require('electron').app.whenReady().then(async ()=>{
  const extensionPath=path.join(userDataPath, 'extensions')
  if(!fs.existsSync(extensionPath)){
    fs.mkdirSync(extensionPath)
  }

  const installedExtensions = await loadExtensions(
    this.session,extensionPath
  )
  console.log('已安装的扩展：',installedExtensions)
})
