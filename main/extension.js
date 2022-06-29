const { ElectronChromeExtensions } = require('electron-chrome-extensions')
let browser
let extensionsMenu = []

let tabs = []
let waitingSyncId = 0

class Browser {
  session = null

  constructor (session) {
    let app = require('electron').app
    this.session = session
    this.init()
    app.on('web-contents-created', this.onWebContentsCreated.bind(this))
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
        // const win = this.createWindow({
        //   initialUrl: details.url || newTabUrl,
        // })
        // if (details.active) tabs.select(tab.id)
        return mainWindow
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


app.whenReady().then(()=>{
  ipc.on('openExtShop',async (e,a)=>{
    if(a.name==='chrome'){
      sendIPCToWindow(mainWindow,'addTab',{url:'https://chrome.google.com/webstore/category/extensions'})
      mainWindow.focus()
    }else if(a.name==="edge"){
      sendIPCToWindow(mainWindow,'addTab',{url:'https://microsoftedge.microsoft.com/addons'})
      mainWindow.focus()
    }else{
      const files = dialog.showOpenDialogSync({
        userScriptWindow,
        filters: [
          { name: '扩展插件', extensions: ['crx'] }
        ], properties: ['openFile', 'multiSelections']
      })
      if(!!!files){
        return
      }
    let installed=0
      let exists=0
      for(let i=0;i<files.length;i++){
        let result=await installCrx(files[i])
        if(result.status===1){
          installed++
        }else if(result.status===-1){
          exists++
        }
      }
      let content= installed>0?'成功安装'+installed+'个插件。':''
      content+=exists>0? exists+'个插件未安装，因为这些插件已经安装。':''
      console.log(content)

      sendMessage({type:'success',config:{content: content }})
    }
  })
})
