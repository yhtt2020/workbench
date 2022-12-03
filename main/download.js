
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
    if (!downloadWindow.isDestroyed()) {
      downloadWindow.webContents.send(action, data || {})
    }
  }
}

let originalPageUrl
ipc.on('originalPage', (event, args) => {
  originalPageUrl = args
})

ipc.on('closeEmpty', (event, args) => {
  mainWindow.webContents.send('closeEmptyPage', args)
})

ipc.on('downloading', (event, args) => {
  mainWindow.send('downloadCountAdd')
})

ipc.on('downloadEnd', (event, args) => {
  mainWindow.send('downloadCountCut')
})

ipc.on('setSavePath', (event, args) => {
  const savePath = dialog.showOpenDialogSync({
    properties: ['openFile', 'openDirectory']
  })
  if (savePath !== undefined) {
    const downloadSavePath = savePath.toString().replace(/\[|]/g, '')
    settings.set('downloadSavePath', downloadSavePath)

    event.reply('getSavePath', downloadSavePath)
  }
})

async function downloadHandler (event, item, webContents) {
  var itemURL = item.getURL()
  var attachment = isAttachment(item.getContentDisposition())
  const suffixName = item.getFilename().substring(item.getFilename().lastIndexOf('.'), item.getFilename().length)
  savePathFilename = path.basename(item.getSavePath())
  const simpleName = item.getFilename().substring(0, item.getFilename().lastIndexOf('.'))
  mainWindow.webContents.send('isDownload')
  // const savePathPrefix = settings.get('downloadSavePath') + '\\'
  const savePathPrefix = settings.get('downloadSavePath')
  var fs = require('fs')
  const fsExists = (fileNewPath) => {
    return fs.existsSync(fileNewPath)
  }
  let num = 1
  let setPath
  let downloadSavePath
  if (item.getMimeType() === 'application/pdf' && itemURL.indexOf('blob:') !== 0 && itemURL.indexOf('#pdfjs.action=download') === -1 && !attachment) { // clicking the download button in the viewer opens a blob url, so we don't want to open those in the viewer (since that would make it impossible to download a PDF)
    event.preventDefault()
    sendIPCToWindow(mainWindow, 'openPDF', {
      url: itemURL,
      tabId: getViewIDFromWebContents(webContents)
    })
  } else {
    if (settings.get('downloadAutoSave') === true) {
      const savePath = dialog.showOpenDialogSync({
        properties: ['openFile', 'openDirectory']
      })
      downloadSavePath = savePath.toString().replace(/\[|]/g, '')
      setPath = path.join(downloadSavePath, item.getFilename())
      item.setSavePath(setPath)
    } else {
      if (settings.get('downloadSavePath') === undefined || settings.get('downloadSavePath') == '') {
        const savePath = dialog.showOpenDialogSync({
          properties: ['openFile', 'openDirectory']
        })
        downloadSavePath = savePath.toString().replace(/\[|]/g, '')
        setPath = path.join(downloadSavePath, item.getFilename())
        item.setSavePath(setPath)
        settings.set('downloadSavePath', downloadSavePath)
      } else {
        const filePath = path.join(savePathPrefix, item.getFilename())
        let res = fsExists(filePath) // 找是否存在
        while (res) { // 存在循环查找
          const newFilePath = path.join(savePathPrefix, (simpleName + '(' + num + ')' + suffixName))
          res = fsExists(newFilePath)
          num++
        }
        // 退出的num不存在
        if (num === 1) {
          item.setSavePath(filePath)
        } else {
          const newFilePath = path.join(savePathPrefix, (simpleName + '(' + (num - 1) + ')' + suffixName))
          item.setSavePath(newFilePath)
        }
      }
    }

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
      if (dec === '00') { // 当小数点后为00时 去掉小数部分
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

      sendIPCToWindow(mainWindow, 'set-file-view', {
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
