let localCacheManager = require(path.join(__dirname, '/js/main/localCacheManager.js'))
const configDb = require(path.join(__dirname, '/pages/util/db/configDb.js'))
const { shell } = require('electron')
const fsExtra=require('fs-extra')
const ElectronLog = require('electron-log')
app.whenReady().then(() => {
  //设置默认的本地收藏夹位置
  configDb.init(app.getPath('userData'))
  const defaultStorePath = configDb.getStorePath()

  //------------------>
  let canCloseInterval = false
  ipc.on('canCloseInterval', (event, args) => {
    canCloseInterval = true
  })
  let interval = setInterval(() => {
    mainWindow.webContents.send('getUserDataPath', defaultStorePath)
    if(canCloseInterval) {
      clearInterval(interval)
    }
  }, 5000)
  //以上部分解决子进程中无法获得到当前收藏夹的storePath路径的问题
  //-----------------

  if (!fs.existsSync(defaultStorePath))
  {
    /**
     * 初始化收藏夹
     * @param defaultStorePath
     */
    function initLib(defaultStorePath){
      fs.mkdirSync(defaultStorePath)
      function createDir(parentPath,dirname){
        if(!fs.existsSync(parentPath)){
          return false
        }else{
          fs.mkdirSync(path.join(parentPath,dirname))
        }
      }
      let commonFolder=[
        '书签','图片','视频','音频','密码','笔记'
      ]
      let jobFolder= {
        'develop':[

        ],
        'pm':[

        ],
        'designer':[

        ],
        'salse':[

        ]
      }
      commonFolder.forEach(folder=>{
        createDir(defaultStorePath,folder)
      })
    }
    initLib(defaultStorePath)
  }
  ipc.on('getUserInfo', (event, args) => {
    SidePanel.send('getUserInfo', { webContentsId: event.sender.id })
  })
  //采集到的内容本地下载下来保存
  ipc.on('getFavContent', async (event, args) => {
    const content = args.content
    let filename = Date.now().toString()//content.src.substr(content.src.lastIndexOf('/'))
    if (content.type === 'img') {
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
      await shell.openPath(filePath).catch((e) => console.warn(e))
    } catch (e) {
      console.warn(e)
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
 let popWindow=null
  function showAddPage(){
    let url='pages/fav/index.html'//decodeURI('file://'+path.join(__dirname,'/pages/fav/index.html?=#/popSaveToFolder'))//开发环境测试环境，提交到版本库前注释掉
    let options={
      hash:'popSaveToFolder'
    }
    if(isDevelopmentMode){
      url='http://localhost:8080/#/popSaveToFolder'
    }

    const bounds=mainWindow.getBounds()
    let currentBounds={width:500,height:500,x:bounds.x+bounds.width-510,y:bounds.y+85}
    if(!popManager.get('favSaveToFolder')){
      ipc.on('addPageReady',()=>popWindow.window.webContents.send('addPage'))//首次准备好之后再发消息获取图片，防止过早获取，应用未准备好接收
    }
    popWindow=popManager.openPop('favSaveToFolder',url,{},{preload:__dirname+'/pages/fav/preload.js'},options)
    popWindow.setBounds(currentBounds)  //重新调整位置，不然会保持在首次创建的位置不再变化
    popWindow.window.webContents.send('addPage')
  }
  ipc.on('openPopSaveToFolder',()=>{
    showAddPage()
  })
  ipc.on('favContextMenu', (event, args) => {
    let menuTemplate = [{
      label: '收藏网页...',
      click: () => {
        showAddPage()
      }
    }, {
      type: 'separator'
    },
      // {
      //   label: '整页截图保存'
      // },
      // {
      //   label: '此页面禁用拖拽保存'
      // },
      // {
      //   label: '此域名下禁用拖拽保存'
      // },
      // {
      //   type: 'separator'
      // },
      {
        label:'打开超级收藏夹',
        click(){
          protocolManager.handleProtocol('tsb://app/redirect/?package=com.thisky.fav&url=/')
        }
      }]
    let menu = require('electron').Menu.buildFromTemplate(menuTemplate)
    menu.popup()
  })

  ipc.on('getAddPageInfo',(event,args)=>{
    sendIPCToWindow(mainWindow,'getAddPageInfo',{favWindowId:event.sender.id})
  })

  ipc.on('hideFavPop',()=>{
    if(popWindow){
      popWindow.window.hide()
    }
  })
  ipc.on('reloadFav',()=>{
    appManager.sendIPCToApp('com.thisky.fav','reload')
  })

  ipc.on('exportFile',(event,args)=>{
   let defaultPath= args.parentPath || args.path
    let filePath
    filePath= dialog.showSaveDialogSync({
      title:'导出内容',
      defaultPath:defaultPath,
      properties:[
        'openDirectory'
      ]
    })
    if(!!!filePath) return
    // if(args.parentPath){
    //    filePath= dialog.showOpenDialogSync({
    //     title:'导出内容',
    //     defaultPath:defaultPath,
    //      properties:[
    //        'openDirectory'
    //      ]
    //   })
    // }else{
    //
    // }
    const storePath=configDb.getStorePath()
    if(filePath.startsWith(storePath))
    {
      event.reply('error',{message:'导出文件不能导出到收藏夹内。'})
      return
    }
    if(!!filePath){
      try{
        fsExtra.copySync(args.path,filePath)
        shell.showItemInFolder(filePath)
        event.reply('success',{message:'导出成功。'})
      }catch (e) {
        event.reply('error',{message:'导出失败，失败原因：'+e.message})
        ElectronLog.log(e)
      }
    }
  })




})
