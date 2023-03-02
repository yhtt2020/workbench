
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

ipc.on('downloadCompletes',(agrs,events)=>{
if(settings.get('downloadAutoSave') != true){
  if(settings.get('saveTips') == undefined || settings.get('saveTips') == false ){
    let result =  dialog.showMessageBoxSync({
      buttons:['去设置','取消'],
      message:'是否需要设置默认保存地址并开启下载自动保存\n（您也可在下载设置页面手动更改）',
      cancelId:1
    })
    switch (result) {
      case 0:
        openSetting({tab:'DownloadSetting'})
    }
    settings.set('saveTips',true)
  }
}
})

function isAttachment (header) {
  return /^\s*attache*?ment/i.test(header)
}

function sendIPCToDownloadWindow (action, data) {
  // if there are no windows, create a new one
  getDownloadWindow()
  setTimeout(()=>{
    if(downloadWindow && !downloadWindow.isDestroyed())
    downloadWindow.webContents.send(action, data || {})
  },20)



  // if (downloadWindow === null || downloadWindow.isDestroyed()) {
  //   createDownloadWin()
  //   downloadWindow.webContents.send(action, data || {})
  //   // getDownloadWindow(function () {
  //   //   downloadWindow.webContents.send(action, data || {})
  //   // })
  // } else {
  //   if (!downloadWindow.isDestroyed()) {
  //     downloadWindow.webContents.send(action, data || {})
  //   }
  // }
}

let originalPageUrl
ipc.on('originalPage', (event, args) => {
  originalPageUrl = args
})

ipc.on('closeEmpty', (event, args) => {
 sendIPCToMainWindow('closeEmptyPage', args)
})

ipc.on('downloading', (event, args) => {
  sendIPCToMainWindow('downloadCountAdd')
})

ipc.on('downloadEnd', (event, args) => {
  sendIPCToMainWindow('downloadCountCut')
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
  let found=ApiHandler.downloadWebContents.find(wc=>{
    return wc.id===webContents.id
  })
  if(found){
    //如果是被监听了下载了，直接返回即可，不用处理
    return
  }
  var itemURL = item.getURL()
  var attachment = isAttachment(item.getContentDisposition())

  const suffixName = require('path').extname(item.getFilename())
  savePathFilename = path.basename(item.getSavePath())
  const simpleName = item.getFilename().substring(0, item.getFilename().lastIndexOf('.'))
  sendIPCToMainWindow('isDownload')
  // const savePathPrefix = settings.get('downloadSavePath') + '\\'
  const savePathPrefix = settings.get('downloadSavePath')
  var fs = require('fs')
  const fsExists = (fileNewPath) => {
    return fs.existsSync(fileNewPath)
  }
  let num = 1
  if (item.getMimeType() === 'application/pdf' && itemURL.indexOf('blob:') !== 0 && itemURL.indexOf('#pdfjs.action=download') === -1 && !attachment) { // clicking the download button in the viewer opens a blob url, so we don't want to open those in the viewer (since that would make it impossible to download a PDF)
    //此处是pdf阅读逻辑
    event.preventDefault()
    sendIPCToWindow(mainWindow, 'openPDF', {
      url: itemURL,
      tabId: getViewIDFromWebContents(webContents)
    })
  } else {
    //此处是下载文件逻辑
    getDownloadWindow()//尝试启动下载助手
    if(settings.get('downloadAutoSave') === true){
      item.setSaveDialogOptions({
        title: '选择保存地址',
        filters: [
          { name: suffixName, extensions: [suffixName.replace('.','')] },
          { name: '自定义', extensions: ['*'] }
        ]
      })
    } else {
      if (settings.get('downloadSavePath') === undefined || settings.get('downloadSavePath') == '') {
        item.setSaveDialogOptions({
          title: '选择保存地址',
          filters: [
            { name: suffixName, extensions: [suffixName.replace('.','')] },
            { name: '自定义', extensions: ['*'] }
          ]
        })

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

    function convert (limit) {
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
      size: { received: 0, total: convert(item.getTotalBytes()) },
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
        size: { received: convert(item.getReceivedBytes()), total: convert(item.getTotalBytes()) },
        // realdata1:item.speed,
        realData: convert(item.speed),
        progressnuw: ((prevReceivedBytes / item.getTotalBytes()).toFixed(2)) * 100,
        paused: item.isPaused(),
        startTime: item.getStartTime(),
        chainUrl: item.getURLChain()
      })
    })

    item.once('done', async function (e, state) {
      delete currrentDownloadItems[item.getSavePath()]
      if (downloadWindow && !downloadWindow.isDestroyed()) {
        downloadWindow.setProgressBar(-1)
      }

      sendIPCToDownloadWindow('download-info', {
        path: item.getSavePath(),
        startTime: item.getStartTime(),
        name: savePathFilename,
        status: state,
        url: item.getURL(),
        size: { received: convert(item.getTotalBytes()), total: convert(item.getTotalBytes()) },
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
