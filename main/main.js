const electron = require('electron')
const fs = require('fs')
const path = require('path')
const electronLog=require('electron-log')
global.SpaceManager=require(__dirname+'/src/main/spaceManager.js')
const KdbxManager=require(__dirname+'/src/main/kdbxManager.js')
global.kdbxManager=new KdbxManager()
const { config } = require(__dirname+'/server-config.js')
global.serverConfig=config
global.isExit=false
var appIsReady = false
let isInstallerRunning = false
var mainMenu = null
let sqlDb

async function ready() {
  console.log('触发ready')
  settings.set('restartNow', false)
  appIsReady = true

  /* the installer launches the app to install registry items and shortcuts,
  but if that's happening, we shouldn't display anything */
  if (isInstallerRunning) {
    return
  }

  //预先创建好快速启动窗口
  //createLanuchBar()
//app.lanuchBar.show()

  // if (isDevelopmentMode) {
  // 	session.defaultSession.loadExtension(
  // 		path.join(__dirname, 'devtools-5.3.4/packages/shell-chrome'),
  // 		// allowFileAccess is required to load the devtools extension on file:// URLs.
  // 		{
  // 			allowFileAccess: true
  // 		}
  // 	)
  // }
  //注册快捷键，用于展示启动界面
  // globalShortcut.register('alt+space', () => {
  // 	//注册全局快捷键
  // 	//todo 判断一下注册失败
  // 	console.log('Electron loves global shortcuts!')

  // 	if (app.lanuchBar) {
  // 		if(app.lanuchBar.isVisible()){
  // 			app.lanuchBar.hide()  //如果已经存在，则隐藏
  // 		}else{
  // 			app.lanuchBar.show()
  // 		}

  // 	} else {
  // 		createLanuchBar()
  // 	}

  // })

  //todo before create
  global.spaceManager = new SpaceManager()
  await global.spaceManager.ensureDb()
  mainMenu = buildAppMenu()
  Menu.setApplicationMenu(mainMenu)
  createDockMenu()
  appStart()
  //每分钟执行提交在线时长
  async function uploadCumulativeTime () {
    try {
      let clientId=settings.get('clientID')
      const userInfo = await userModel.getCurrent()
      const options = {
        uid: userInfo && userInfo.data.uid != 0 ? userInfo.data.uid : 0, // 用户uid
        client_id: clientId // 设备号
      }

      await baseApi.init()
      baseApi.axios('/app/open/usageStats/cumulativeTime', options, 'post').catch(e => {
        console.warn('上传在线时长失败', e)
      }).then((rs) => {
        //console.log('提交在线时长成功',rs)
      })
    } catch (e) {
      console.warn('上传在线时间意外错误', e)
    }
  }

  setInterval(uploadCumulativeTime, 1000 * 60) // 每分钟上报在线时间
}
await ready()

crashReporter.start({
	submitURL: 'https://minbrowser.org/',
	uploadToServer: false,
	compress: true
})

if (process.argv.some(arg => arg === '-v' || arg === '--version')) {
	console.log('TSBrowser: ' + app.getVersion())
	console.log('Chromium: ' + process.versions.chrome)
	process.exit()
}


global.isDevelopmentMode = process.argv.some(arg => arg === '--development-mode')
console.log(process.argv,'启动参数们')
 if (process.platform === 'win32')
{
  //修复通知出现应用名electron.app
    app.setAppUserModelId(app.name);
}
function clamp(n, min, max) {
	return Math.max(Math.min(n, max), min)
}
//如果是命令行下，会执行注册表的功能。
if (process.platform === 'win32') {
	// (async function() {
  //   await registryInstaller.install().then(()=>{
  //     console.log('reg success')
  //   },(err)=>{
  //     console.log(err)
  //   })
    // registryInstaller.uninstall()
		// var squirrelCommand = process.argv[1]
		// if (squirrelCommand === '--squirrel-install' || squirrelCommand === '--squirrel-updated') {
		// 	isInstallerRunning = true
		// 	await registryInstaller.install()
		// }
		// if (squirrelCommand === '--squirrel-uninstall') {
		// 	isInstallerRunning = true
		// 	await registryInstaller.uninstall()
		// }
		// if (require('electron-squirrel-startup')) {
		// 	app.quit()
		// }
	// })()
}

//调整执行顺序，保证数据调试的数据目录没错
const args = process.argv.slice(2);

// 检查是否存在 user-data-dir 参数
const userDataDirIndex = args.findIndex(arg => arg.startsWith('--user-data-dir='));
if (userDataDirIndex !== -1) {
  // 提取 user-data-dir 参数的值
  const userDataDir = args[userDataDirIndex].split('=')[1];

  // 设置应用的数据目录为 user-data-dir
  app.setPath('userData', userDataDir);
}

if (isDevelopmentMode) {
	app.setPath('userData', app.getPath('userData') + '-development')
}
//获取参数并进行判断

electronLog.transports.file.file=app.getPath('userData')+'/myLog.log'

electronLog.transports.file.level = "debug"
electronLog.transports.console.level='debug'
// workaround for flicker when focusing app (https://github.com/electron/electron/issues/17942)
app.commandLine.appendSwitch('disable-backgrounding-occluded-windows', 'true')

const originDataPath=app.getPath('userData') //记录下原始路径，后面会判断是不是原始路径，如果是原始路径，则直接退出。
// 获取命令行参数


global.userDataPath = app.getPath('userData')
//必须先加载到userData目录才可以加载settings

const browserPage = 'file://' + __dirname + '/index.html'

global.mainWindow = null
var mainWindowIsMinimized = false // workaround for https://github.com/minbrowser/min/issues/1074

var secondaryMenu = null
var isFocusMode = false

var isToolbar = true

const isFirstInstance = app.requestSingleInstanceLock()

if (!isFirstInstance) {
  if(global.userDataPath===originDataPath)
  {
    //如果是原始路径，也就是没有通过参数启动，则直接退出
    app.quit()
    return
  }
}

global.saveWindowBounds = function() {
	if (mainWindow) {
		var bounds = Object.assign(mainWindow.getBounds(), {
			maximized: mainWindow.isMaximized()
		})
		fs.writeFileSync(path.join(userDataPath, 'windowBounds.json'), JSON.stringify(bounds))
	}
}

/**
 *
 * @param window
 * @param action
 * @param data
 * @param createWindow 如果窗口不存在，是否创建后发送，默认为是
 */
function sendIPCToWindow(window, action, data,needCreateWindow=true) {
	// if there are no windows, create a new one
	if (!mainWindow) {
    if(needCreateWindow){
      //如果是要求创建后再发的才发，不然就直接放弃了
      createWindow(function() {
        if(global.URLToOpen){
          mainWindow.webContents.send('addTab',{url:global.URLToOpen})
          global.URLToOpen=''
        }
        mainWindow.webContents.on('did-finish-load', function () {
          // if a URL was passed as a command line argument (probably because Min is set as the default browser on Linux), open it.
          mainWindow.webContents.send(action, data || {})
        })
      })
    }
	} else {
		mainWindow.webContents.send(action, data || {})
	}
}

function openTabInWindow(url) {
	sendIPCToWindow(mainWindow, 'addTab', {
		url: url
	})
}

function handleCommandLineArguments(argv) {
	// the "ready" event must occur before this function can be used
	if (argv) {
		argv.forEach(function(arg, idx) {
			if (arg && arg.toLowerCase() !== __dirname.toLowerCase()) {
				// URL
				if (arg.indexOf('://') !== -1) {
					sendIPCToWindow(mainWindow, 'addTab', {
						url: arg
					})
				} else if (idx > 0 && argv[idx - 1] === '-s') {
					// search
					sendIPCToWindow(mainWindow, 'addTab', {
						url: arg
					})
				} else if (/\.(m?ht(ml)?|pdf)$/.test(arg) && fs.existsSync(arg)) {
					// local files (.html, .mht, mhtml, .pdf)
					sendIPCToWindow(mainWindow, 'addTab', {
						url: 'file://' + path.resolve(arg)
					})
				}
			}
		})
	}
}

function createWindow(cb) {
	fs.readFile(path.join(userDataPath, 'windowBounds.json'), 'utf-8', function(e, data) {
		var bounds
    let displayBounds
    if (data) {
			try {
				bounds = JSON.parse(data)
			} catch (e) {
				console.warn('error parsing window bounds file: ', e)
			}
		}
		if (e || !data || !bounds) { // there was an error, probably because the file doesn't exist
			var size = electron.screen.getPrimaryDisplay().workAreaSize
      const initWidth=1366
      const initHeight=950
      let width=size.width>initWidth?initWidth:size.width
      let height=(size.width>initWidth && initHeight<size.height)?initHeight:size.height

			bounds = {
        x:size.width/2-width/2,
        y:size.height/2-height/2,
				width: width,
				height: height,
				maximized: false
			}
      displayBounds={
        x: 0,
        y: 0,
        width: size.width,
        height: size.height,
      }
		}else{
      displayBounds=bounds
    }



		// make the bounds fit inside a currently-active screen
		// (since the screen Min was previously open on could have been removed)
		// see: https://github.com/minbrowser/min/issues/904
		var containingRect = electron.screen.getDisplayMatching(displayBounds).workArea

		bounds = {
      x:containingRect.width/2-bounds.width/2,
      y:containingRect/2-bounds.height/2,
			width: bounds.width,
			height: bounds.height,
			maximized: bounds.maximized
		}

		createWindowWithBounds(bounds)

		if (cb) {
			cb()
		}
	})
}



function createWindowWithBounds(bounds) {
  let icon=__dirname + '/icons/logo1024.png'

  if(process.platform==='win32'){
    icon=__dirname + '/icons/logowin.ico'
  }
	mainWindow = new BrowserWindow({
		width: bounds.width,
		height: bounds.height,
		x: bounds.x,
		y: bounds.y,
		minWidth: (process.platform === 'win32' ? 600 :
			320), // controls take up more horizontal space on Windows
		minHeight: 350,
		titleBarStyle: settings.get('useSeparateTitlebar') ? 'default' : 'hidden',
		trafficLightPosition: {
			x: 12,
			y: 10
		},
    show:true,
		icon: icon,
    acceptFirstMouse:true,
		frame: false,//不再从配置中取是否带边框参数
		alwaysOnTop: settings.get('windowAlwaysOnTop'),
		backgroundColor: '#fff',//backgroundColor: '#fff', // the value of this is ignored, but setting it seems to work around https://github.com/electron/electron/issues/10559
		webPreferences: {
      preload: __dirname + '/js/defaultPreload.js',
			nodeIntegration: true,
			contextIsolation: false,
			nodeIntegrationInWorker: true, // used by ProcessSpawner
			additionalArguments: [
				'--user-data-path=' + userDataPath,
				'--app-version=' + app.getVersion(),
				'--app-name=' + app.getName(),
				...((isDevelopmentMode ? ['--development-mode'] : [])),
			]
		}
	})
  forceClose=false

	// windows and linux always use a menu button in the upper-left corner instead
	// if frame: false is set, this won't have any effect, but it does apply on Linux if "use separate titlebar" is enabled
	if (process.platform !== 'darwin') {
		mainWindow.setMenuBarVisibility(false)
	}
  if(require('electron').session.defaultSession.protocol.isProtocolRegistered('crx')===false){
    browser = new Browser(electron.session.fromPartition('persist:webcontent'))
    let timer=setInterval(()=>{
      // console.log('检查会话是否注册了协议',require('electron').session.defaultSession.protocol.isProtocolRegistered('crx'))
      if(require('electron').session.defaultSession.protocol.isProtocolRegistered('crx'))
      {
        mainWindow.loadURL(browserPage)
        clearInterval(timer)
      }
    },100)
  }else{
    browser = new Browser(electron.session.fromPartition('persist:webcontent'))
    mainWindow.loadURL(browserPage)
  }

	// and load the index.html of the app.


	if (bounds.maximized) {
		mainWindow.maximize()

		mainWindow.webContents.on('did-finish-load', function() {
			sendIPCToWindow(mainWindow, 'maximize')
		})
	}
    async function askCloseExit() {
      let askCloseExit = settings.get('askCloseExit')
      if(askCloseExit===undefined){
        askCloseExit=true
      }
      let closeExit
      if (askCloseExit === true) {
        let choose = await dialog.showMessageBox(mainWindow, {
          message: '是否完全退出浏览器？',
          type: 'info',
          defaultId: 1,
          title: '退出选择',
          detail: '完全退出之后，将无法累计在线时长、无法接收消息，还将增加打开浏览器的耗时。选『节能后台运行』，则保留到托盘菜单，且以最低内存运行。建议后台运行。',
          checkboxLabel: '不再询问',
          buttons: [
            '完全退出（同时关闭工作台）',
            '节能后台运行（保留工作台）'
          ]
        })
        if (choose.checkboxChecked) {
          settings.set('askCloseExit', false)
          settings.set('closeExit', choose.response)
        }
        closeExit = choose.response
      }else{
        closeExit=settings.get('closeExit')
        if(closeExit===undefined){
          closeExit=1
        }
      }
      if (closeExit === 0) {
        app.exit()
      }
    }
	mainWindow.on('close', async function (e) {

    if (!canCloseMainWindow) {
      safeCloseMainWindow()//发送给主窗体，告知其需要安全关闭，其准备好关闭后会重新触发
      mainWindow.hide()
      e.preventDefault()
      return
    }
    destroyAllViews()
    // save the window size for the next launch of the app
    saveWindowBounds()
    if(isExit){
      app.exit()
    }
  })
  mainWindow.on('ready-to-show',()=>{
    mainWindow.show()
    loadSidePanel()
    changingSpace=false
  })
  function checkClipboard(){
    let latestClipboardContent=clipboard.readText()
    if(latestClipboardContent!==clipboardContent && (latestClipboardContent.startsWith('http://') || latestClipboardContent.startsWith('https://')))
    {
      clipboardContent=latestClipboardContent
      sendIPCToWindow(mainWindow,'showClipboard',{url:latestClipboardContent})
    }
  }
  let ClipTimer=setInterval(()=>{
    if(mainWindow){
      if(!mainWindow.isDestroyed()){
        if(mainWindow.isFocused() && mainWindow.isVisible()){
          checkClipboard()
        }
      }
    }
  },1000)
  mainWindow.on('focus',()=>{
    checkClipboard()
  })


	// Emitted when the window is closed.
	mainWindow.on('closed', function() {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		mainWindow = null
		mainWindowIsMinimized = false
    if(process.platform==='win32' && !changingSpace){
      if(userWindow){
        return
      }
      if(typeof trayExit === 'undefined' || !trayExit){
        askCloseExit()
      }else{
        app.exit()
      }

     //windows上，且不是在切换空间，则关闭整个应用
      // todo 如果做了托盘菜单，这里不需要直接退出app
     //app.quit()
    }
	})

	mainWindow.on('focus', function() {
		if (!mainWindowIsMinimized) {
			sendIPCToWindow(mainWindow, 'windowFocus')
		}
	})

	mainWindow.on('minimize', function() {
		sendIPCToWindow(mainWindow, 'minimize')
		mainWindowIsMinimized = true
	})

	mainWindow.on('restore', function() {
		mainWindowIsMinimized = false
	})

	mainWindow.on('maximize', function() {
		sendIPCToWindow(mainWindow, 'maximize')
	})

	mainWindow.on('unmaximize', function() {
		sendIPCToWindow(mainWindow, 'unmaximize')
	})

	mainWindow.on('enter-full-screen', function() {
		sendIPCToWindow(mainWindow, 'enter-full-screen')
	})

	mainWindow.on('leave-full-screen', function() {
		sendIPCToWindow(mainWindow, 'leave-full-screen')
		// https://github.com/minbrowser/min/issues/1093
		mainWindow.setMenuBarVisibility(false)
	})

	mainWindow.on('enter-html-full-screen', function() {
		sendIPCToWindow(mainWindow, 'enter-html-full-screen')
	})

	mainWindow.on('leave-html-full-screen', function() {
		sendIPCToWindow(mainWindow, 'leave-html-full-screen')
		// https://github.com/minbrowser/min/issues/952
		mainWindow.setMenuBarVisibility(false)
	})

	mainWindow.on('showBookmarks',function(){
		sendIPCToWindow(mainWindow,'showBookmarks')
	})

	//loadSidebar()
	sendIPCToWindow(mainWindow,'getTitlebarHeight')
	addMainWindowEventListener()


	/*
	Handles events from mouse buttons
	Unsupported on macOS, and on Linux, there is a default handler already,
	so registering a handler causes events to happen twice.
	See: https://github.com/electron/electron/issues/18322
	*/
	if (process.platform === 'win32') {
		mainWindow.on('app-command', function(e, command) {
			if (command === 'browser-backward') {
				sendIPCToWindow(mainWindow, 'goBack')
			} else if (command === 'browser-forward') {
				sendIPCToWindow(mainWindow, 'goForward')
			}
		})
	}

	// prevent remote pages from being loaded using drag-and-drop, since they would have node access
	mainWindow.webContents.on('will-navigate', function(e, url) {
		if (url !== browserPage) {
			e.preventDefault()
		}
	})

	mainWindow.setTouchBar(buildTouchBar())
  global.utilWindow = mainWindow
	return mainWindow

}





// Quit when all windows are closed.
app.on('window-all-closed', function() {
	// On OS X it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin' && !changingSpace) {
		//app.quit()
	}
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.

function handleUrlOpen(url){
  if (mainWindow && !mainWindow.isDestroyed()) {
    //从应用准备好，改为主窗体准备好
    sendIPCToWindow(mainWindow, 'addTab', {
      url: url
    })
    if(mainWindow){
      if(mainWindow.isMinimized()){
        mainWindow.restore()
      }
      mainWindow.focus()
    }
  } else {
    global.URLToOpen = url // this will be handled later in the createWindow callback


  }
}
app.on('open-url', function(e, url) {
  handleUrlOpen(url)
})
app.on('open-file', function(e, url) {
  handleUrlOpen('file://'+url)
})
app.on('second-instance', function(e, argv, workingDir) {
	if (mainWindow) {
		if (mainWindow.isMinimized()) {
			mainWindow.restore()
		}
		mainWindow.focus()
		// add a tab with the new URL
		handleCommandLineArguments(argv)
	}else{
    createWindow()
  }
})

/**
 * Emitted when the application is activated, which usually happens when clicks on the applications's dock icon
 * https://github.com/electron/electron/blob/master/docs/api/app.md#event-activate-os-x
 *
 * Opens a new tab when all tabs are closed, and min is still open by clicking on the application dock icon
 */
app.on('activate', function( /* e, hasVisibleWindows */ ) {
	if (!mainWindow &&
		appIsReady
		) { // sometimes, the event will be triggered before the app is ready, and creating new windows will fail
		//createWindow()
    appStart()
	}
})

/**
 * 启动应用，此方法会自动判断是否启动的时候显示选择空间的面板
 * @returns {Promise<void>}
 */
async function appStart () {
  const { SqlDb } = require('./src/util/sqldb.js')
  sqlDb = new SqlDb()
  console.log('触发appstart')
  initFav()
  let showOnStart = await sqlDb.getConfig('system.user.showOnStart')
  if (!showOnStart) {
    let tableMod=settings.get('tableMod')
    console.log(tableMod,'tableMod')
    if(tableMod===undefined){
      //首次运行
      settings.set('tableMod','table')//设置为工作台模式
      return
    }
    if(( tableMod==='table') && !global.URLToOpen){
      //工作台模式，且没有要打开的网址
      console.log('触发工作台模式')
      return
    }else{
      //浏览器模式
      console.log('打开浏览器',tableMod,global.URLToOpen)
      createWindow(function () {
        mainWindow.webContents.on('did-finish-load', function () {
          // if a URL was passed as a command line argument (probably because Min is set as the default browser on Linux), open it.
          handleCommandLineArguments(process.argv)
          // there is a URL from an "open-url" event (on Mac)
          if (global.URLToOpen) {
            // if there is a previously set URL to open (probably from opening a link on macOS), open it
            sendIPCToWindow(mainWindow, 'addTab', {
              url: global.URLToOpen
            })
            global.URLToOpen = null
          }
        })
      })
    }
  } else {
    showUserWindow()
  }
}


ipc.on('focusMainWebContents', function() {
	mainWindow.webContents.focus()
})

ipc.on('showSecondaryMenu', function(event, data) {
	if (!secondaryMenu) {
		secondaryMenu = buildAppMenu({
			secondary: true
		})
	}
	secondaryMenu.popup({
		x: data.x,
		y: data.y
	})
})


//设置默认浏览器部分结束
ipc.on('quit', function() {
	app.quit()
})

app.on('ready', function() {
  nativeTheme.on('updated', function () {
    settings.set('systemShouldUseDarkColors', electron.nativeTheme.shouldUseDarkColors)
  })

  if (electron.nativeTheme.shouldUseDarkColors !== settings.get('systemShouldUseDarkColors')) {
    settings.set('systemShouldUseDarkColors', electron.nativeTheme.shouldUseDarkColors)
  }
app.on('before-quit',()=>{
  if(isExit){
    app.exit()
  }
  global.isExit=true
})

})

// ipc.on('showBookmarks',function(){
// 	mainWindow.removeBrowserView(sidebarView)
// 	sendIPCToWindow(mainWindow,'showBookmarks')

// })
/**
 * 安全关闭主窗体，主窗体会先同步完成空间保存，之后再发送ipc告诉主进程进行安全关闭
 */
function safeCloseMainWindow(){
  sendIPCToWindow(mainWindow,'safeClose')
}
let canCloseMainWindow=false
ipc.on('closeMainWindow',(event,args)=>{
  if(isExit){
    canCloseMainWindow=true
    app.exit()
  }
  if(mainWindow && !mainWindow.isDestroyed()){
    canCloseMainWindow=true
    mainWindow.close()
  }
})

let canQuit=false
ipc.on('quitApp',()=>{
  canQuit=true
  app.quit()
})
ipc.on('errorClose',(e,args)=>{
  //此处为遇到意外的情况下，重新显示mainWindow，并提示用户保存失败。可再次点击关闭。
  // electronLog.error('意外关闭',args.error)
  // if(mainWindow && !mainWindow.isDestroyed()){
  //   mainWindow.show()
  //   sendMessage({type:'error',config:{content:'关闭保存意外失败，您可以再次点击关闭，在不保存的情况下继续使用，此消息将在10秒后自动消失。',duration:'10'}})
  // }
})

// const { BarrageManager }=require(path.join(__dirname,'/src/main/barrageManager.js'))
app.whenReady().then(()=>{
  // setTimeout(()=>{
  //   global.barrageManager=new BarrageManager(windowManager)
  //   barrageManager.init()
  // },1000)


  // ipc.on('toggleBarrage',()=>{
  //  barrageManager.toggle()
  // })
  //
  //  ipc.on('closeBarrageWindow', () => {
  //     barrageManager.close()
  //   })
  //
  // ipc.on('barrage.changeUrl',(e,a)=>{
  //   if(typeof barrageManager !=='undefined')
  //    barrageManager.changeUrl(a.url)
  // })

  ipc.on('tabs.current',(e,a)=>{
    //这是一个非常经典的ipc.sendSync的回调实现。
    function getCurrentTab(callBack){
      ipc.once('gotCurrentTab',(e,args)=>{
        callBack(args.data)
      })
      if(mainWindow && !mainWindow.isDestroyed()){
        //如果浏览器启动着
        sendIPCToWindow(mainWindow,'getCurrentTab')
      }else{
        callBack({})//如果浏览器没启动，返回空对象
      }
    }
    getCurrentTab((data)=>{
      e.returnValue=data
    })
  })

  // ipc.on('barrage.lock',(e,a)=>{
  //   barrageManager.lock()
  // })
  //
  // ipc.on('barrage.unlock',()=>{
  //   barrageManager.unlock()
  // })

  ipc.on('setAutoRun',(event,args)=>{
    let autoRun=args.value
    if(autoRun){
      app.setLoginItemSettings({
        openAtLogin:true,
        path:process.execPath,
        args:[]
      })
    }else{
      app.setLoginItemSettings({
        openAtLogin:false,
        path:process.execPath,
        args:[]
      })
    }
    settings.set('autoRun',autoRun)
  })

  ipc.on('selectDir',(event)=>{
    event.returnValue=dialog.showOpenDialogSync(undefined,{
      properties:['openDirectory']
    }
    )

  })
  ipc.on('selectFile',(event)=>{
    event.returnValue=dialog.showOpenDialogSync(undefined,{
      filters: [
        { name: '图片', extensions: [ 'png'] }
      ],
        properties:['openFile']
      }
    )
  })
})
