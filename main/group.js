let groupIMWindow=null
let alwaysHide = false
app.on('ready', () => {
  let createGroupWindow = null
  let fromRender = null
  let teamTip = null
  let osxSearchMember = null
  let osxInviteMember = null
  let osxCircleSetting = null
  let osxCreateCircle = null
  ipc.on('createGroup', (event, arg) => {
    if (createGroupWindow !== null ) {
      createGroupWindow.focus()
      return //如果已经创建了，则不再重复创建
    }
    createGroupWindow = new BrowserWindow({
      backgroundColor: 'black',
      parent: mainWindow,
      width: 420,
      height: 720,
      maximizable:false,
      resizable: false,
      acceptFirstMouse: true,
      webPreferences: {
        //preload: path.join(__dirname, '/pages/group/create.js'),
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
    createGroupWindow.setMenu(null)
    createGroupWindow.webContents.loadURL('file://' + __dirname + '/pages/group/create.html')
    createGroupWindow.on('close',()=>createGroupWindow=null)
    if(arg) {
      if(arg.from === 'groupComp') {
        //消息来源，后续需要返回消息的webContents，这里只对groupComp发来的ipc通信做存储
        fromRender = event.sender
      }
    }
  })
  ipc.on('closeCreateGroupWindow', () => {
    createGroupWindow.destroy()
    createGroupWindow = null
  })

  ipc.on('refreshGroupComp', (event, arg) => {
    if(fromRender) {
      fromRender.send('callback-refreshGroupComp')
    }
    fromRender = null
  })

  ipc.on('refreshMyGroups', () => {
    //同在main中可以直接拿到SidePanel的webContents
    if(SidePanel.alive()) {
      sidePanel.get().webContents.send('refreshMyGroups')
    }
  })

  //圈子创建引导页
  ipc.on('teamTip', (event, args) => {
    if (teamTip !== null ) {
      teamTip.focus()
      return
    }
    teamTip = new BrowserWindow({
      minimizable: false,
      parent: null,
      width: 600,
      height: 420,
      maximizable:false,
      resizable: false,
      webPreferences: {
        devTools: true,
        preload: __dirname + '/pages/circle/teamTip/teamTipPreload.js',
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
    teamTip.webContents.loadURL('file://' + __dirname + '/pages/circle/teamTip/index.html')
    teamTip.on('close', () => teamTip = null)
    teamTip.webContents.on('did-finish-load', () => {
      teamTip.webContents.send('circleId', args)
    })
  })

  //圈子搜索添加成员
  ipc.on('osxOpenSearchMember', (event, args) => {
    if(osxSearchMember !== null) {
      osxSearchMember.focus()
      return
    }
    osxSearchMember = new BrowserWindow({
      minimizable: false,
      parent: null,
      width: 500,
      height: 600,
      maximizable:false,
      resizable: false,
      webPreferences: {
        devTools: true,
        partition: 'persist:webcontent',
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
    const { api } = require(path.join(__dirname, '//server-config.js'))
    osxSearchMember.webContents.loadURL(`${api.getUrl(api.API_URL.user.CIRCLE_ADD_USER)}?id=${args}`)
    osxSearchMember.on('close', () => osxSearchMember = null)
  })

  //圈子邀请添加成员
  ipc.on('osxOpenInviteMember', (event, args) => {
    if(osxInviteMember !== null) {
      osxInviteMember.focus()
      return
    }
    osxInviteMember = new BrowserWindow({
      minimizable: false,
      parent: null,
      width: 420,
      height: 250,
      maximizable:false,
      resizable: false,
      webPreferences: {
        devTools: true,
        partition: 'persist:webcontent',
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
    const { api } = require(path.join(__dirname, '//server-config.js'))
    osxInviteMember.webContents.loadURL(`${api.getUrl(api.API_URL.user.CIRCLE_INVITELINK)}?id=${args}`)
    osxInviteMember.on('close', () => osxInviteMember = null)
  })

  //圈子设置
  ipc.on('osxOpenCircleSetting', (event, args) => {
    if(osxCircleSetting !== null) {
      osxCircleSetting.focus()
      return
    }
    osxCircleSetting = new BrowserWindow({
      minimizable: false,
      parent: null,
      width: 780,
      height: 660,
      maximizable:false,
      resizable: false,
      webPreferences: {
        partition: 'persist:webcontent',
        devTools: true,
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
    const { api } = require(path.join(__dirname, '//server-config.js'))
    osxCircleSetting.webContents.loadURL(`${api.getUrl(api.API_URL.user.CIRCLE_SETTING)}?type=edit&id=${args}&index=0&forumName=info`)
    osxCircleSetting.on('close', () => osxCircleSetting = null)
  })

  //创建圈子
  ipc.on('osxCreateCircle', (event, args) => {
    if(osxCreateCircle !== null) {
      osxCreateCircle.focus()
      return
    }
    osxCreateCircle = new BrowserWindow({
      minimizable: false,
      parent: null,
      width: 780,
      height: 660,
      maximizable:false,
      resizable: false,
      webPreferences: {
        preload: __dirname + '/pages/circle/createPreload.js',
        partition: 'persist:webcontent',
        devTools: true,
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
    const { api } = require(path.join(__dirname, '//server-config.js'))
    osxCreateCircle.webContents.loadURL(api.getUrl(api.API_URL.user.CIRCLE_SETTING))
    osxCreateCircle.webContents.executeJavaScript(`
      const btn = document.getElementsByClassName('form-item')[0].childNodes[0]
      let confirmBtn = null
      btn.addEventListener('click', () => {
        //window.$ipc.send('teamTip')
        confirmBtn = document.getElementsByClassName('button-box')[0] ? document.getElementsByClassName('button-box')[0].childNodes[2] : null
        if(confirmBtn) {
          confirmBtn.onclick = () => {
            let toastel
            let interval = setInterval(() => {
              toastel = document.getElementsByClassName('xm-toast')[0]
              if (toastel && toastel.innerText === '创建成功') {
                clearInterval(interval)
                setTimeout(() => {
                  window.close()
                }, 1000)
              }
            }, 200)
          }
        }
      })
    `, true)
    osxCreateCircle.on('close', () => osxCreateCircle = null)
  })

})

app.on('before-quit', () => {
  if(groupIMWindow) {
    groupIMWindow.destroy()
    groupIMWindow = null
  }
})
