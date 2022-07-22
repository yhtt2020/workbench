let userScriptWindow = null

function createUserScriptWin (args) {
  // url:当前网页的url，完整的url
  // pos：展现坐标位置
  // title：窗口标题，站点名称
  // tabData：当前的tab对象
  if (userScriptWindow === null) {
    userScriptWindow = new BrowserWindow({
      frame: true,
      backgroundColor: 'white',
      parent: mainWindow,
      center: true,
      hasShadow: true,
      minWidth: 800,
      width: 800,
      autoHideMenuBar: true,
      minHeight: 600,
      height: 600,
      acceptFirstMouse: true,
      maximizable: false,
      visualEffectState: 'active',
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        additionalArguments: [
          '--user-data-path=' + userDataPath,
          '--app-version=' + app.getVersion(),
          '--app-name=' + app.getName(),
          ...((isDevelopmentMode ? ['--development-mode'] : [])),
        ]
      }
    })
    var parent_x = mainWindow.getPosition()[0]
    var parent_y = mainWindow.getPosition()[1]
    var parent_size_x = mainWindow.getSize()[0]
    var parent_size_y = mainWindow.getSize()[1]
    var userScriptWindow_size_x = userScriptWindow.getSize()[0]
    var userScriptWindow_size_y = userScriptWindow.getSize()[1]
    var userScriptWindows_new_x = parent_x + (parent_size_x - userScriptWindow_size_x) / 2
    var userScriptWindow_new_y = parent_y + (parent_size_y - userScriptWindow_size_y) / 2
    userScriptWindow.setPosition(parseInt(userScriptWindows_new_x), parseInt(userScriptWindow_new_y), false)

    userScriptWindow.webContents.loadURL('file://' + __dirname + '/pages/userScript/index.html')
    //siteCardWindow.webContents.openDevTools()
    userScriptWindow.on('close', () => userScriptWindow = null)
    userScriptWindow.on('show', () => {
      userScriptWindow.focus()
    })

  } else {
    userScriptWindow.close()
    userScriptWindow = null
  }
}

app.whenReady().then(() => {
  const userScriptPath = userDataPath + '/userscripts'
  ipc.on('exportScript',(event,args)=>{
    const filename=args.filename
    const path=dialog.showSaveDialogSync(userScriptWindow,{title:'导出脚本',defaultPath:args.filename})
    console.log(path)
    if(!!!path){
      return
    }else{
      fs.copyFileSync(userScriptPath+'/'+filename,path)
    }
  })

  ipc.on('importScript', (event, args) => {
    let existsCount = 0
    let imported = 0
    let existsFilename = []
    userScriptWindow.setAlwaysOnTop(false)
    mainWindow.focus()
    const files = dialog.showOpenDialogSync({
      userScriptWindow,
      filters: [
        { name: '脚本文件', extensions: ['js'] }
      ], properties: ['openFile', 'multiSelections']
    })
    if(!!!files){
      return
    }
     if(!fs.existsSync(userScriptPath)){
     	fs.mkdirSync(userScriptPath)
     }
    files.forEach((file) => {
      let  filename=''
      if(isWin()){
         filename= file.slice(file.lastIndexOf('\\') + 1, file.length)
      }else{
        filename = file.slice(file.lastIndexOf('/') + 1, file.length)
      }
      const target = userScriptPath + '/' + filename

      if (fs.existsSync(target)) {
        existsCount++
        existsFilename.push(filename)
      } else {
        fs.copyFileSync(file, target)
        if (fs.existsSync(target)) {
          imported++
        }
      }

    })
    if (existsCount > 0) {
      sendMessage({
        type: 'info',
        config: { content: '成功导入' + imported + '个脚本，导入失败' + existsCount + '个脚本。导入失败的脚本名称如下：\n' + existsFilename.join('\n')+' 新导入的脚本需要重启浏览器方可生效。' }
      })
    } else {
      sendMessage({ type: 'success', config: { content: '成功导入' + imported + '个脚本。新导入的脚本需要重启浏览器方可生效。' } })
    }
    userScriptWindow.setAlwaysOnTop(true)
    userScriptWindow.webContents.reload()

  })
  ipc.on('openScriptManager', (event, args) => {
    createUserScriptWin()
  })
  ipc.on('viewCode', (event, args) => {
    const file = args.file
    let viewCodeWindow = new BrowserWindow({
      frame: true,
      backgroundColor: 'white',
      parent: mainWindow,
      center: true,
      hasShadow: true,
      minWidth: 800,
      width: 800,
      autoHideMenuBar: true,
      minHeight: 600,
      height: 600,
      acceptFirstMouse: true,
      maximizable: false,
      visualEffectState: 'active',
      alwaysOnTop: true,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        additionalArguments: [
          '--user-data-path=' + userDataPath,
          '--app-version=' + app.getVersion(),
          '--app-name=' + app.getName(),
          '--file=' + file.filename,
          ...((isDevelopmentMode ? ['--development-mode'] : [])),
        ]
      }
    })
    viewCodeWindow.webContents.loadURL('file://' + __dirname + '/pages/userScript/code.html')
  })

  /**
   * 导入密码
   */
  ipc.on('importPwd', (event, args) => {
    const files = dialog.showOpenDialogSync({
      userScriptWindow,
      filters: [
        { name: '密码导出文件', extensions: ['csv'] }
      ], properties: ['openFile']
    })
    if(!!!files){
      return
    }
    const csv=require('csvtojson')
    let importedPwds=[]
    files.forEach((file) => {
      csv().fromFile(file).then(json=>{
        // {
        // [1]     name: 'miwifi.com',
        // [1]     url: 'http://miwifi.com/cgi-bin/luci/web',
        // [1]     username: '',
        // [1]     password: 'chenyixiao1'
        // [1]   }  edge导入格式
        function convertFromChrome(item){
          return {
            domain: item.name,
            username: item.username,
            password: item.password,
            alias: item.url
          }
          //从chrome、edge导入密码
        }
        function convertFromSafari(item){
          let domain=item.URL.replace('http://','').replace('https://','').replace('/','')//清理掉http和https
          return {
            domain:domain,
            username:item.Username,
            password:item.Password,
            alias:item.Title
          }
        }
        function convertFromFirefox(item){
          let domain=item.url.replace('http://','').replace('https://','').replace('/','')//清理掉http和https
          return {
            domain:domain,
            username:item.username,
            password:item.password,
            alias:item.formActionOrigin
          }
        }
        let from='Chrome或Edge'
        try{
          //{"domain":"passport.aliyun.com","username":"thisky","password":"Xiangtian1!"}  文件存储格式
          json.forEach(item=>{
            let account={}
            let isSafari=(typeof item.OTPAuth !=='undefined')
            let isFirefox=(typeof item.formActionOrigin!=='undefined')
            if(isSafari){
              //是safari
              from='Safari'
              account=convertFromSafari(item)
            }else if(isFirefox) {
              from='Firefox'
              account=convertFromFirefox(item)
              //是火狐
            }else {
              account = convertFromChrome(item)
            }
            credentialStoreSetPassword(account)
            importedPwds.push(account)
          })
        }catch (e){
          event.reply('importPwdFailed',{message:'解析密码文件失败。'})
          return
        }

        if(importedPwds.length===0){
          event.reply('importPwdFailed',{message:'无任何密码需要导入。'})
        }else{
          event.reply('importPwdSuccess',{imported:importedPwds.length,importedPwds:importedPwds,from:from})
        }
      }).catch((err)=>{
        event.reply('importPwdFailed',{message:'解析密码文件失败。'})
      })
    })
  })
})
