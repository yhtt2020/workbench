
const currrentDownloadItems = {}

// ipc.on('cancelDownload', function (e, path) {
//   if (currrentDownloadItems[path]) {
//     currrentDownloadItems[path].cancel()
//   }
// })

ipc.on('stopDownload',function (e,path){
  if (currrentDownloadItems[path]) {
    currrentDownloadItems[path].pause()
  }
})

ipc.on('resumeDownload',function (e,path){
  if (currrentDownloadItems[path]) {
    currrentDownloadItems[path].resume()
  }
})

ipc.on('deleteDownload',function (e,path){
  if (currrentDownloadItems[path]) {
    currrentDownloadItems[path].cancel()
  }
})

function isAttachment (header) {
  return /^\s*attache*?ment/i.test(header)
}

function sendIPCToDownloadWindow(action, data) {
  // if there are no windows, create a new one
  if (!downloadWindow) {
    createWindow(function() {
      downloadWindow.webContents.send(action, data || {})
    })
  } else {
    downloadWindow.webContents.send(action, data || {})
  }
}

function downloadHandler (event, item, webContents) {
  var itemURL = item.getURL()
  var attachment = isAttachment(item.getContentDisposition())

  if (item.getMimeType() === 'application/pdf' && itemURL.indexOf('blob:') !== 0 && itemURL.indexOf('#pdfjs.action=download') === -1 && !attachment) { // clicking the download button in the viewer opens a blob url, so we don't want to open those in the viewer (since that would make it impossible to download a PDF)
    event.preventDefault()
    sendIPCToDownloadWindow( 'openPDF', {
      url: itemURL,
      tabId: getViewIDFromWebContents(webContents)
    })
  } else {
    var savePathFilename

    // send info to download manager
    sendIPCToDownloadWindow('download-info', {
      path: item.getSavePath(),
      name: item.getFilename(),
      status: 'start',
      size: { received: 0, total: item.getTotalBytes() },
      paused: item.isPaused(),
      startTime:item.getStartTime(),
      Url:item.getURL(),
      ChainUrl:item.getURLChain()
    })


    let prevReceivedBytes = 0
    item.on('updated', function (e, state) {
      const receivedBytes = item.getReceivedBytes()
      // 计算每秒下载的速度
      item.speed = receivedBytes - prevReceivedBytes
      prevReceivedBytes = receivedBytes

      if (!savePathFilename) {
        savePathFilename = path.basename(item.getSavePath())
      }

      if (item.getSavePath()) {
        currrentDownloadItems[item.getSavePath()] = item
      }

      downloadWindow.setProgressBar(item.getReceivedBytes() / item.getTotalBytes())
      sendIPCToDownloadWindow('download-info', {
        path: item.getSavePath(),
        name: savePathFilename,
        status: state,
        size: { received: item.getReceivedBytes(), total: item.getTotalBytes() },
        realdata:item.speed,
        progressnuw:((prevReceivedBytes/item.getTotalBytes()).toFixed(2))*100,
        paused: item.isPaused(),
        startTime:item.getStartTime()

      })

      console.log({
        realdata:item.speed,
        progressnuw:((prevReceivedBytes/item.getTotalBytes()).toFixed(2))*100,
        paused:item.isPaused()
      })

    })

    item.once('done', function (e, state) {
      delete currrentDownloadItems[item.getSavePath()]
      if (!downloadWindow.isDestroyed()) {
        downloadWindow.setProgressBar(-1);
      }
      sendIPCToDownloadWindow( 'download-info', {
        path: item.getSavePath(),
        name: savePathFilename,
        status: state,
        Url:item.getURL(),
          size: { received: item.getTotalBytes(), total: item.getTotalBytes() }
      })
    })
  }
  return true

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
        sendIPCToDownloadWindow( 'openPDF', {
          url: details.url,
          tabId: null
        })
        return
      }

      // whether this is a file being viewed in-browser or a page
      // Needed to save files correctly: https://github.com/minbrowser/min/issues/1717
      // It doesn't make much sense to have this here, but only one onHeadersReceived instance can be created per session
      const isFileView = typeHeader instanceof Array && !typeHeader.some(t => t.includes('text/html'))

      sendIPCToDownloadWindow( 'set-file-view', {
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


