/*
Wraps APIs that are only available in the main process in IPC messages, so that the BrowserWindow can use them
*/

ipc.handle('test-invoke', function () {
  return 1
})

ipc.handle('reloadWindow', function () {
  mainWindow.webContents.reload()
})

ipc.handle('startFileDrag', function (e, path) {
  app.getFileIcon(path, {}).then(function (icon) {
    mainWindow.webContents.startDrag({
      file: path,
      icon: icon
    })
  })
})

ipc.handle('showFocusModeDialog1', function () {
  dialog.showMessageBox({
    type: 'info',
    buttons: [l('closeDialog')],
    message: l('isFocusMode'),
    detail: l('focusModeExplanation1') + ' ' + l('focusModeExplanation2')
  })
})

ipc.handle('showFocusModeDialog2', function () {
  dialog.showMessageBox({
    type: 'info',
    buttons: [l('closeDialog')],
    message: l('isFocusMode'),
    detail: l('focusModeExplanation2')
  })
})

ipc.handle('showFirstGuideDialog', function () {
  dialog.showMessageBox({
    type: 'info',
    buttons: ['确定退出','继续完成'],
    noLink:true,
    message: '这是首次新手引导',
    detail: '新手引导可以使您快速了解想天浏览器的功能，强烈建议完成引导'
  }).then((index) => {
    if (index.response === 0) {
      mainWindow.send('exitFirstGuide')
      mainWindow.send('closeGuide')
      SidePanel.send('guide',7)
    }
  });
})


ipc.handle('openBlockTips', function () {
  dialog.showMessageBox({
    // type: 'info',
    buttons: ['忽略','查看引导'],
    noLink:true,
    defaultId:1,
    detail: '检测到当前网站有多个广告或行为被拦截器拦截，如果影响正常浏览体验，请将该网站加入白名单'
  }).then((index) => {
    if (index.response === 1) {
      mainWindow.webContents.send('blockGuide')
    }
  });
})


ipc.handle('showGuideDialog', function () {
  dialog.showMessageBox({
    type: 'info',
    buttons: [l('closeDialog')],
    message: '当前处于引导模式',
    detail: '请先完成或退出引导'
  })
})
ipc.handle('showToolbarDialog', function () {
  dialog.showMessageBox({
    type: 'info',
    buttons: [l('closeDialog')],
    message: '已收起工具栏',
    detail: '如要显示工具栏，请到【菜单】-【查看】-【显示/隐藏工具栏】中勾选显示。'
  })
})

// ipc.handle('showThirdToolbarDialog', () => {
//   dialog.showMessageBox({
//     buttons: ['取消', '确定'],
//     message: '确定要关闭引导栏吗？',
//     detail: '完成全部新用户引导即可获得限时纪念勋章'
//   }).then(index => {
//     if(index.response === 1) {
//       mainWindow.webContents.send('hideThirdToolbar')
//     }
//   })
// })


ipc.handle('showOpenDialog', async function (e, options) {
  const result = await dialog.showOpenDialog(mainWindow, options)
  return result.filePaths
})

ipc.handle('showSaveDialog', async function (e, options) {
  const result = await dialog.showSaveDialog(mainWindow, options)
  return result.filePath
})


ipc.handle('addWordToSpellCheckerDictionary', function (e, word) {
  session.fromPartition('persist:webcontent').addWordToSpellCheckerDictionary(word)
})

ipc.handle('downloadURL', function (e, url) {
  mainWindow.webContents.downloadURL(url)
})

ipc.handle('clearStorageData', function () {
  return session.fromPartition('persist:webcontent').clearStorageData()
  /* It's important not to delete data from file:// from the default partition, since that would also remove internal browser data (such as bookmarks). However, HTTP data does need to be cleared, as there can be leftover data from loading external resources in the browser UI */
    .then(function () {
      return session.defaultSession.clearStorageData({ origin: 'http://' })
    })
    .then(function () {
      return session.defaultSession.clearStorageData({ origin: 'https://' })
    })
    .then(function () {
      return session.fromPartition('persist:webcontent').clearCache()
    })
    .then(function () {
      return session.fromPartition('persist:webcontent').clearHostResolverCache()
    })
    .then(function () {
      return session.fromPartition('persist:webcontent').clearAuthCache()
    })
    .then(function () {
      return session.defaultSession.clearCache()
    })
    .then(function () {
      return session.defaultSession.clearHostResolverCache()
    })
    .then(function () {
      return session.defaultSession.clearAuthCache()
    })
})

/* window actions */

ipc.handle('minimize', function (e) {
  mainWindow.minimize()

  // workaround for https://github.com/minbrowser/min/issues/1662
  mainWindow.webContents.send('minimize')
})

ipc.handle('maximize', function (e) {
  mainWindow.maximize()
  // workaround for https://github.com/minbrowser/min/issues/1662
  mainWindow.webContents.send('maximize')
})

ipc.handle('unmaximize', function (e) {
  mainWindow.unmaximize()
  // workaround for https://github.com/minbrowser/min/issues/1662
  mainWindow.webContents.send('unmaximize')
})

ipc.handle('close', function (e) {
  //mainWindow.close()
  //更改为安全关闭
  safeCloseMainWindow()
})

ipc.handle('setFullScreen', function (e, fullScreen) {
  mainWindow.setFullScreen(e, fullScreen)
})


ipc.on('openThirdToolbarMenu', () => {
  let templ = [
    {
      label: '关闭',
      click: () => {
        dialog.showMessageBox({
          buttons: ['取消', '确定'],
          message: '确定要关闭引导栏吗？',
          detail: '完成全部新用户引导即可获得限时纪念勋章'
        }).then(index => {
          if(index.response === 1) {
            mainWindow.webContents.send('hideThirdToolbar')
          }
        })
      }
    }
  ]

  let menu = require('electron').Menu.buildFromTemplate(templ)

  menu.popup()
})

ipc.on('finishedGuideHiddenThirdToolbar', () => {
  mainWindow.webContents.send('hideThirdToolbar')
})
