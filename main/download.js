const { extname, resolve, join } = require('path')
const { promises } = require('fs')
const parseCrx = require('./js/main/crx.js')
const extractZip = require('./js/main/zip.js')
const { getPath } = require('./js/main/paths')
const { makeId } = require('./js/main/string')
const { pathExists } = require('./js/main/files')
const currrentDownloadItems = {}

// ipc.on('cancelDownload', function (e, path) {
//   if (currrentDownloadItems[path]) {
//     currrentDownloadItems[path].cancel()
//   }
// })

ipc.on('stopDownload', function (e, path) {
  if (currrentDownloadItems[path]) {
    currrentDownloadItems[path].pause()
  }
})

ipc.on('resumeDownload', function (e, path) {
  if (currrentDownloadItems[path]) {
    currrentDownloadItems[path].resume()
  }
})

ipc.on('deleteDownload', function (e, path) {
  if (currrentDownloadItems[path]) {
    currrentDownloadItems[path].cancel()
  }
})

function isAttachment (header) {
  return /^\s*attache*?ment/i.test(header)
}

function sendIPCToDownloadWindow (action, data) {
  // if there are no windows, create a new one

  if (downloadWindow === null) {
    getDownloadWindow(function () {
      downloadWindow.webContents.send(action, data || {})
    })
  } else {
    downloadWindow.webContents.send(action, data || {})
  }

}

let originalPageUrl
ipc.on('originalPage', (event, args) => {
  originalPageUrl = args
})
// let emptyPageUrl
// ipc.on('emptyPage',(event,args)=>{
//    emptyPageUrl = args
// })

ipc.on('emptyPageUrl', (event, args) => {
  mainWindow.webContents.send('closeEmptyPage', args)
})
ipc.on('downloading', (event, args) => {
  mainWindow.send('downloadCountAdd')
})
ipc.on('downloadEnd', (event, args) => {
  mainWindow.send('downloadCountCut')
})

function downloadHandler (event, item, webContents) {
  var itemURL = item.getURL()
  var attachment = isAttachment(item.getContentDisposition())
  let suffixName = item.getFilename().substring(item.getFilename().lastIndexOf('.') + 1, item.getFilename().length)
  savePathFilename = path.basename(item.getSavePath())

  if (item.getMimeType() === 'application/pdf' && itemURL.indexOf('blob:') !== 0 && itemURL.indexOf('#pdfjs.action=download') === -1 && !attachment) { // clicking the download button in the viewer opens a blob url, so we don't want to open those in the viewer (since that would make it impossible to download a PDF)
    event.preventDefault()
    sendIPCToWindow(mainWindow, 'openPDF', {
      url: itemURL,
      tabId: getViewIDFromWebContents(webContents)
    })
  } else {

    item.setSaveDialogOptions({
      title: '选择保存地址',
      filters: [
        { name: suffixName, extensions: [suffixName] },
        { name: '自定义', extensions: ['*'] }
      ]
    })
    // event.preventDefault()

    var savePathFilename

    function conver (limit) {
      var size
      if (limit < 1024 * 1024) {
        size = (limit / 1024).toFixed(2) + 'KB'
      } else if (limit < 1024 * 1024 * 1024) {
        size = (limit / (1024 * 1024)).toFixed(2) + 'MB'
      } else {
        size = (limit / (1024 * 1024 * 1024)).toFixed(2) + 'GB'
      }
      var sizeStr = size + ''
      var len = sizeStr.indexOf('\.')
      var dec = sizeStr.substr(len + 1, 2)
      if (dec === '00') {//当小数点后为00时 去掉小数部分
        return sizeStr.substring(0, len) + sizeStr.substr(len + 3, 2)
      }
      return sizeStr
    }

    sendIPCToDownloadWindow('download-info', {
      path: item.getSavePath(),
      name: item.getFilename(),
      status: 'start',
      size: { received: 0, total: conver(item.getTotalBytes()) },
      paused: item.isPaused(),
      startTime: item.getStartTime(),
      url: item.getURL(),
      href: originalPageUrl,
      chainUrl: item.getURLChain()
    })

    let prevReceivedBytes = 0
    item.on('updated', function (e, state) {

      const receivedBytes = item.getReceivedBytes()
      // 计算每秒下载的速度
      item.speed = receivedBytes - prevReceivedBytes
      prevReceivedBytes = receivedBytes

      let updateName
      if (!savePathFilename) {
        updateName = path.basename(item.getSavePath())
        savePathFilename = updateName
      }

      if (item.getSavePath()) {
        currrentDownloadItems[item.getSavePath()] = item
      }

      if (downloadWindow != null && !downloadWindow.isDestroyed()) {
        downloadWindow.setProgressBar(item.getReceivedBytes() / item.getTotalBytes())
      }

      sendIPCToDownloadWindow('download-info', {
        path: item.getSavePath(),
        name: savePathFilename,
        status: state,
        size: { received: conver(item.getReceivedBytes()), total: conver(item.getTotalBytes()) },
        // realdata1:item.speed,
        realData: conver(item.speed),
        progressnuw: ((prevReceivedBytes / item.getTotalBytes()).toFixed(2)) * 100,
        paused: item.isPaused(),
        startTime: item.getStartTime(),
        chainUrl: item.getURLChain()
      })

    })

    item.once('done', async function (e, state) {
      delete currrentDownloadItems[item.getSavePath()]
      if (!downloadWindow.isDestroyed()) {
        downloadWindow.setProgressBar(-1)
      }

      sendIPCToDownloadWindow('download-info', {
        path: item.getSavePath(),
        startTime: item.getStartTime(),
        name: savePathFilename,
        status: state,
        url: item.getURL(),
        size: { received: conver(item.getTotalBytes()), total: conver(item.getTotalBytes()) },
        href: originalPageUrl,
        chainUrl: item.getURLChain()
      })

      if (extname(savePathFilename) === '.crx') {
        installCrx(item.savePath)
      }

    })

    return true
  }
}

function listenForDownloadHeaders (ses) {

  ses.webRequest.onHeadersReceived(function (details, callback) {
    if (details.resourceType === 'mainFrame' && details.responseHeaders) {
      // workaround for https://github.com/electron/electron/issues/24334
      var typeHeader = details.responseHeaders[Object.keys(details.responseHeaders).filter(k => k.toLowerCase() === 'content-type')]
      var attachment = isAttachment(details.responseHeaders[Object.keys(details.responseHeaders).filter(k => k.toLowerCase() === 'content-disposition')])

      if (typeHeader instanceof Array && typeHeader.filter(t => t.includes('application/pdf')).length > 0 && details.url.indexOf('#pdfjs.action=download') === -1 && !attachment) {
        // open in PDF viewer instead
        callback({ cancel: true })
        sendIPCToWindow(mainWindow, 'openPDF', {
          url: details.url,
          tabId: null
        })
        return
      }

      // whether this is a file being viewed in-browser or a page
      // Needed to save files correctly: https://github.com/minbrowser/min/issues/1717
      // It doesn't make much sense to have this here, but only one onHeadersReceived instance can be created per session
      const isFileView = typeHeader instanceof Array && !typeHeader.some(t => t.includes('text/html'))

      sendIPCToDownloadWindow('set-file-view', {
        url: details.url,
        isFileView
      })
    }

    callback({ cancel: false })
  })
}

app.once('ready', function () {
  session.defaultSession.on('will-download', downloadHandler)
  listenForDownloadHeaders(session.defaultSession)
})

app.on('session-created', function (session) {
  session.on('will-download', downloadHandler)
  listenForDownloadHeaders(session)
})

async function askInstall (manifestPath, crxInfo) {
  const manifest = JSON.parse(
    await promises.readFile(manifestPath, 'utf8'),
  )
  renderPage.openInstallExtension({ manifest, crxInfo ,manifestPath})
}
ipc.on('installCrx',(event,args)=>{
  installCrx(args.path)
})
ipc.on('doInstallCrx', (event, args) => {
  doInstallCrx(args.manifestPath,{
    id:args.crxInfo.id,
    publicKey:args.crxInfo.publicKey
  })
})

async function doInstallCrx (manifestPath, crxInfo) {
  const extensionsPath = join(userDataPath, 'extensions')
  const tempPath = join(userDataPath, 'temp_extensions')
  const tempCrxPath = resolve(tempPath, crxInfo.id)
  let installPath = resolve(extensionsPath, crxInfo.id)
  require('fs-extra').copySync(tempCrxPath,installPath)
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
    let content= '成功安装插件。'
    sendMessage({type:'success',config:{content: content ,key:'extension'}})
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
