const { ElectronChromeExtensions } = require('electron-chrome-extensions')
const parseCrx = require('./js/main/crx.js')
const extractZip = require('./js/main/zip.js')
const { getPath } = require('./js/main/paths')
const { makeId } = require('./js/main/string')
const { pathExists } = require('./js/main/files')
const { promises } = require('fs')
const { extname, resolve, join } = require('path')
let browser
let extensionsMenu = []
let extensions = null
let tabs = []
let waitingSyncId = 0

class Browser {
  session = null

  constructor (session) {
    this.session = session
    if (extensions) {
      this.extensions = extensions
      sendIPCToWindow(mainWindow, 'loadedExtensions')
    } else {
      this.init()
      require('electron').app.on('web-contents-created', this.onWebContentsCreated.bind(this))
    }
  }

  initSession () {

  }

  async onWebContentsCreated (event, webContents) {
    // webContents.on('new-window', (event, url, frameName, disposition, options) => {
    //   // event.preventDefault()
    //
    //   switch (disposition) {
    //     case 'foreground-tab':
    //     case 'background-tab':
    //     case 'new-window':
    //       const win = this.getIpcWindow(event)
    //       const tab = win.tabs.create()
    //       tab.loadURL(url)
    //       break
    //   }
    // })
    webContents.on('context-menu', (event, params) => {
      extensionsMenu = this.extensions.getContextMenuItems(webContents, params)
      // const menu = buildChromeContextMenu({
      //   params,
      //   webContents,
      //   extensionMenuItems: this.extensions.getContextMenuItems(webContents, params),
      //   openLink: (url, disposition) => {
      //     const win = this.getFocusedWindow()
      //
      //     switch (disposition) {
      //       case 'new-window':
      //         this.createWindow({ initialUrl: url })
      //         break
      //       default:
      //         const tab = win.tabs.create()
      //         tab.loadURL(url)
      //     }
      //   },
      // })
    })
  }

  async init () {

    this.initSession()
    this.extensions = new ElectronChromeExtensions({
      session: this.session,

      // mainSession:require('electron').session.defaultSession,//提交一个主会话
      createTab: (details) => {
        waitingSyncId = Date.now()
        sendIPCToWindow(mainWindow, 'addTab', { url: details.url })
        tabs[waitingSyncId] = {}//赋值一个空对象,先返回，再通过完成创建的时候修改这个对象的指向来更新对象
        return [tabs[waitingSyncId], mainWindow]
      },
      selectTab: (tab, browserWindow) => {
        let id = getViewIDFromWebContents(tab)
        //sendIPCToWindow(mainWindow,'switchToTab',{tabId:id})
      },
      removeTab: (tab, browserWindow) => {
        let id = getViewIDFromWebContents(tab)
        sendIPCToWindow(mainWindow, 'closeTab', { id: id })
      },

      createWindow: (details) => {
        conosle.log('触发createWindow')
        // const win = this.createWindow({
        //   initialUrl: details.url || newTabUrl,
        // })
        // if (details.active) tabs.select(tab.id)
        return mainWindow
      },
      removeWindow: (browserWindow) => {
        conosle.log('触发removeWindow')
        const win = this.getWindowFromBrowserWindow(browserWindow)
        win?.destroy()
      },
    })

    extensions = this.extensions
    const extensionPath = path.join(userDataPath, 'extensions')
    if (!fs.existsSync(extensionPath)) {
      fs.mkdirSync(extensionPath)
    }
    const installedExtensions = await loadExtensions(
      this.session, extensionPath
    )
    if (!require('electron').session.defaultSession.protocol.isProtocolRegistered('crx'))
      this.extensions.setupProtocol(require('electron').session.defaultSession)

    // const extensions=new ElectronChromeExtensions({session:require('electron').session.defaultSession})
    // extensions.addTab(mainWindow.webContents, mainWindow)
    // await loadExtensions(
    //   require('electron').session.defaultSession, extensionPath
    // )
    // console.log(require('electron').session.defaultSession.getAllExtensions())
    sendIPCToWindow(mainWindow, 'loadedExtensions')
  }

  // setupProtocol () {
  //   let mainSession = require('electron').session.defaultSession
  //   mainSession.registerBufferProtocol('crx',(request,callback)=>{
  //     let response: Electron.ProtocolResponse
  //
  //     try {
  //       const url = new URL(request.url)
  //       const { hostname: requestType } = url
  //
  //       switch (requestType) {
  //         case 'extension-icon': {
  //           const tabId = url.searchParams.get('tabId')
  //
  //           const fragments = url.pathname.split('/')
  //           const extensionId = fragments[1]
  //           const imageSize = parseInt(fragments[2], 10)
  //           const resizeType = parseInt(fragments[3], 10) || ResizeType.Up
  //
  //           const extension = this.session.getExtension(extensionId)
  //
  //           let iconDetails: chrome.browserAction.TabIconDetails | undefined
  //
  //           const action = this.actionMap.get(extensionId)
  //           if (action) {
  //             iconDetails = (tabId && action.tabs[tabId]?.icon) || action.icon
  //           }
  //
  //           let iconImage
  //
  //           if (extension && iconDetails) {
  //             if (typeof iconDetails.path === 'string') {
  //               const iconAbsPath = resolveExtensionPath(extension, iconDetails.path)
  //               if (iconAbsPath) iconImage = nativeImage.createFromPath(iconAbsPath)
  //             } else if (typeof iconDetails.path === 'object') {
  //               const imagePath = matchSize(iconDetails.path, imageSize, resizeType)
  //               const iconAbsPath = imagePath && resolveExtensionPath(extension, imagePath)
  //               if (iconAbsPath) iconImage = nativeImage.createFromPath(iconAbsPath)
  //             } else if (typeof iconDetails.imageData === 'string') {
  //               iconImage = nativeImage.createFromDataURL(iconDetails.imageData)
  //             } else if (typeof iconDetails.imageData === 'object') {
  //               const imageData = matchSize(iconDetails.imageData as any, imageSize, resizeType)
  //               iconImage = imageData ? nativeImage.createFromDataURL(imageData) : undefined
  //             }
  //           }
  //
  //           if (iconImage) {
  //             response = {
  //               statusCode: 200,
  //               mimeType: 'image/png',
  //               data: iconImage.toPNG(),
  //             }
  //           } else {
  //             response = { statusCode: 400 }
  //           }
  //
  //           break
  //         }
  //         default: {
  //           response = { statusCode: 400 }
  //         }
  //       }
  //     } catch (e) {
  //       console.error(e)
  //
  //       response = {
  //         statusCode: 500,
  //       }
  //     }
  //
  //     callback(response)
  //   })
  // }
}

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

async function doInstallCrx (manifestPath, crxInfo) {
  const extensionsPath = join(userDataPath, 'extensions')
  const tempPath = join(userDataPath, 'temp_extensions')
  const tempCrxPath = resolve(tempPath, crxInfo.id)
  let installPath = resolve(extensionsPath, crxInfo.id)
  require('fs-extra').copySync(tempCrxPath, installPath)
  const extension = await electron.session.fromPartition('persist:webcontent').loadExtension(installPath)

  if (crxInfo.publicKey) {
    const manifest = JSON.parse(
      await promises.readFile(manifestPath, 'utf8'),
    )

    manifest.key = crxInfo.publicKey.toString('base64')
    await promises.writeFile(
      manifestPath,
      JSON.stringify(manifest, null, 2),
    )
    let content = '成功安装插件。'
    renderPage.sendIPC('extensionList','reload')
    sendMessage({ type: 'success', config: { content: content, key: 'extension' } })
  }

}

async function installCrx (filePath) {
  const crxBuf = await promises.readFile(filePath)
  const crxInfo = parseCrx(crxBuf)

  if (!crxInfo.id) {
    crxInfo.id = makeId(32)
  }

  //先解压到临时安装目录
  const tempPath = join(userDataPath, 'temp_extensions')
  const extensionsPath = join(userDataPath, 'extensions')
  const path = resolve(extensionsPath, crxInfo.id)

  if (await pathExists(path)) {
    //插件已存在，阻止安装
    sendMessage({ type: 'error', config: { content: '插件已存在。' } })
    return
  }
  let tempCrxPath = resolve(tempPath, crxInfo.id)
  if (!fs.existsSync(resolve(tempPath))) {
    //不存在则创建一个临时目录
    fs.mkdirSync(tempPath)
  }
  if (fs.existsSync(tempCrxPath)) {
    //如果已经存在这个插件，直接删除掉这个插件的缓存
    require('fs-extra').removeSync(tempCrxPath)
  }

  await extractZip(crxInfo.zip, tempCrxPath)//解压到临时目录
  const manifestPath = resolve(tempCrxPath, 'manifest.json')
  askInstall(manifestPath, crxInfo)
  // window.send('load-browserAction', extension);
}

app.whenReady().then(() => {
  ipc.on('hideExtension', (event, args) => {
    let hideExtensions = configDb.dbInstance.get('hideExtensions').value()
    if (!!!hideExtensions) {
      configDb.dbInstance.set('hideExtensions', [args.baseName]).write()
      return
    }
    if (hideExtensions && hideExtensions.indexOf(args.baseName) === -1) {
      hideExtensions.push(args.baseName)
      configDb.dbInstance.set('hideExtensions', hideExtensions).write()
    }
    sendIPCToWindow(mainWindow,'hideExtension',{baseName:args.baseName})

  })
  ipc.on('showExtension', (event, args) => {
    let hideExtensions = configDb.dbInstance.get('hideExtensions').value()
    if (hideExtensions && hideExtensions.indexOf(args.baseName) > -1) {
      hideExtensions.splice(hideExtensions.indexOf(args.baseName), 1)
      configDb.dbInstance.set('hideExtensions', hideExtensions).write()
    }
    sendIPCToWindow(mainWindow,'showExtension',{baseName:args.baseName})
  })

  ipc.handle('getHideExtensions', (event) => {
    let hideBaseNames=configDb.dbInstance.get('hideExtensions').value()
    if(!!!hideBaseNames){
      hideBaseNames=[]
    }
    let installed = require('electron').session.fromPartition('persist:webcontent').getAllExtensions()
    let hideIds=[]
    installed.forEach(ext=>{
      ext.hide= hideBaseNames.some(hideExt=>{
        return ext.path.indexOf(hideExt)>-1
      })
      if(ext.hide){
       hideIds.push(ext.id)
      }
    })
    return hideIds
  })

  ipc.handle('getInstalledExtensions', (event) => {
    let installed = require('electron').session.fromPartition('persist:webcontent').getAllExtensions()
    let hide = configDb.dbInstance.get('hideExtensions').value()
    if (!!!hide) {
      installed.forEach(ext => {
        ext.hide = false
      })
    } else {
      installed.forEach(ext => {
        ext.hide = hide.some(hideBaseName => {
          return ext.path.indexOf(hideBaseName) > -1
        })
      })
    }
    return installed
  })

  ipc.on('showPopList', () => {
    renderPage.openExtensionPopList()
  })
  ipc.on('openExtShop', async (e, a) => {
    if (a.name === 'chrome') {
      sendIPCToWindow(mainWindow, 'addTab', { url: 'https://chrome.google.com/webstore/category/extensions' })
      mainWindow.focus()
    } else if (a.name === 'edge') {
      sendIPCToWindow(mainWindow, 'addTab', { url: 'https://microsoftedge.microsoft.com/addons' })
      mainWindow.focus()
    } else {
      const files = dialog.showOpenDialogSync({
        userScriptWindow,
        filters: [
          { name: '扩展插件', extensions: ['crx'] }
        ], properties: ['openFile']
      })
      if (!!!files) {
        return
      }
      for (let i = 0; i < files.length; i++) {
        await installCrx(files[i])
      }
    }
  })

  ipc.on('installCrx',(event,args)=>{
    installCrx(args.path)
  })
  ipc.on('doInstallCrx', (event, args) => {
    doInstallCrx(args.manifestPath,{
      id:args.crxInfo.id,
      publicKey:args.crxInfo.publicKey
    })
  })

})
async function askInstall (manifestPath, crxInfo) {
  const manifest = JSON.parse(
    await promises.readFile(manifestPath, 'utf8'),
  )
  renderPage.openInstallExtension({ manifest, crxInfo ,manifestPath})
}
