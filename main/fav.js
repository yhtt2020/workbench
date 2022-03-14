let localCacheManager = require(path.join(__dirname, '/js/main/localCacheManager.js'))
const configDb = require(path.join(__dirname, '/pages/util/db/configDb.js'))
const { shell } = require('electron')

app.whenReady().then(() => {
  //设置默认的本地收藏夹位置
  configDb.init(app.getPath('userData'))
  const defaultStorePath = configDb.getStorePath()

  if (!fs.existsSync(defaultStorePath)) fs.mkdirSync(defaultStorePath)
  ipc.on('getUserInfo', (event, args) => {
    SidePanel.send('getUserInfo', { webContentsId: event.sender.id })
  })
  //采集到的内容本地下载下来保存
  ipc.on('getFavContent', async (event, args) => {
    console.log('收到采集内容的ipc', args)
    const content = args.content
    let filename = Date.now().toString()//content.src.substr(content.src.lastIndexOf('/'))
    if (content.type === 'img') {
      console.log(content)
      content.src.substr(content.src.lastIndexOf('/'))
      if (filename.length > 30) {
        if (filename.indexOf('?')) {
          filename = filename.substr(0, filename.indexOf('?'))
        }
        filename = filename.substr(0, 30) + filename.substr(filename.indexOf('.'))
      }
      let fullPath = path.join(defaultStorePath, filename)
      localCacheManager.fetchContentWithType(content.src, fullPath).then((header) => {
        let ext = header.substr(header.lastIndexOf('/') + 1)
        if (ext === 'svg+xml') {
          ext = 'svg'
        }
        let newFileName = ''
        if (content.alt !== '') {
          newFileName = content.alt.length > 20 ? content.alt.substr(0, 20) + '.' + ext : content.alt + '.' + ext
        } else {
          newFileName = content.title.length > 20 ? content.title.substr(0, 20) + '.' + ext : content.title + '.' + ext
        }
        let i = 0
        let testFileName = newFileName
        while (fs.existsSync(path.join(defaultStorePath, testFileName))) {
          i++
          testFileName = newFileName.substr(0, newFileName.lastIndexOf('.')) + '-' + i.toString() + newFileName.substr(newFileName.lastIndexOf('.'))
        }
        let lastPath = testFileName
        console.log(path.join(defaultStorePath, filename), path.join(defaultStorePath, lastPath))
        fs.renameSync(path.join(defaultStorePath, filename), path.join(defaultStorePath, lastPath))

        if (fs.existsSync(path.join(defaultStorePath, newFileName))) {
          sidePanel.get().webContents.send('message', { type: 'success', config: { content: '收藏到本地成功。' } })
        } else {
          sidePanel.get().webContents.send('message', { type: 'error', config: { content: '收藏失败，请检查网络。' } })
        }
      }).catch(e => {
        sidePanel.get().webContents.send('message', { type: 'error', config: { content: '收藏失败，请检查网络。' } })
      })
    }

  })

  ipc.on('openDir', (event, args) => {
    shell.openPath(args.dir)
  })
  ipc.on('showItemInFolder', (event, args) => {
    let filePath = args.fullPath
    if (process.platform === 'win32') {
      filePath = filePath.replaceAll('/', '\\')
    }
    shell.showItemInFolder(filePath)
  })
  ipc.on('openExternal', async (event, args) => {
    try {
      let filePath = args.fullPath
      if (process.platform === 'win32') {
        filePath = filePath.replaceAll('/', '\\')
      }
      await shell.openPath(filePath).catch((e) => console.log(e))
      console.log(filePath)
    } catch (e) {
      console.log(e)
    }

  })
  ipc.on('setWallPaper', (event, args) => {
    sendIPCToWindow(mainWindow, 'setWallPaper', { wallPaper: args.wallPaper, tip: false })
  })
  ipc.on('trashItem', (event, args) => {
    let filePath = args.fullPath
    if (process.platform === 'win32') {
      filePath = filePath.replaceAll('/', '\\')
    }
    shell.trashItem(filePath)
  })
  ipc.on('createDir', (event, args) => {
    try {
      if (fs.existsSync(args.path + '/' + args.dirName)) {
        event.reply('createDirResult', { result: 'false', message: '存在同名文件夹。' })
        return
      }
      fs.mkdirSync(args.path + '/' + args.dirName)
      if (fs.existsSync(args.path + '/' + args.dirName)) {
        event.reply('createDirResult', { result: 'true', message: '创建文件夹成功。' })
      }
    } catch (e) {
      event.reply('createDirResult', { result: 'false', message: '请检查输入是否符合规范。' })
    }
  })

  ipc.on('favContextMenu', (event, args) => {
    let menuTemplate = [{
      label: '将网页保存至收藏夹',
      click: () => {
      }
    }, {
      type: 'separator'
    },
      {
        label: '整页截图保存'
      },
      {
        label: '此页面禁用拖拽保存'
      },
      {
        label: '此域名下禁用拖拽保存'
      }]
    let menu = require('electron').Menu.buildFromTemplate(menuTemplate)
    menu.popup()
  })
})
