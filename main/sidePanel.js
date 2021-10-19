let sidePanel = null


class SidePanel {
	_sidePanel = null
	titlebarHeight = 20
	panelWidth = 800
	mainViewBounds = null
	isStandalone = false //是否是独立
	constructor() {
		//this.mainViewBounds = mainWindow.getBounds()
	}
	/**
	 * 返回sidePanel实例
	 */
	static getSidePanel() {
		return this._sidePanel
	}
	//判断是否存在sidebar
	static alive() {
		if (sidePanel == null || typeof(sidePanel) == 'undefined') {
			return false
		} else if (typeof(sidePanel._sidePanel) == 'undefined') {
			return false
		} else if (sidePanel.isDestroyed()) {
			return false
		}
		return true
	}

	isVisible() {
		return this._sidePanel.isVisible()
	}


	isDestroyed() {
		if (this._sidePanel == null || typeof(this._sidePanel) == 'undefined')
			return true
		return this._sidePanel.isDestroyed()
	}
	/**
	 * 初始化sidePanel并载入、设置好位置
	 */
	init() {
		this._sidePanel = new BrowserWindow({
			transparent: true,
			frame: false,
			parent: mainWindow,
			hasShadow: false,
			width: 0,
			height: 0,
			resizable: false,
			acceptFirstMouse: true,
			roundedCorners: false,
			visualEffectState: 'active',
			webPreferences: {
				preload: path.join(__dirname, '/pages/sidebar/sidebarPreload.js'),
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
		// if (process.platform == 'win32') {
		// 	this.titlebarHeight = 48
		// }
		this._sidePanel.webContents.loadURL('file://' + __dirname + "/pages/sidebar/sidebar.html")
		//windows上首次载入就要设置一下位置
		this.syncSize()
		//this.setTop()
		this._sidePanel.hide()
		//if (isDevelopmentMode)
		//this._sidePanel.webContents.openDevTools()
		let that = this
		//左侧栏和主界面都失去焦点的时候，取消掉自身的置顶，以防止捅破别的地方
		// this._sidePanel.on('blur', function() {
		// 	if (!mainWindow.isFocused()) {
		// 		that.unsetTop()
		// 	}
		// })

		this._sidePanel.on('close', function() {
			console.log('sidebar-close:左侧栏隐藏')
		})

		this._sidePanel.on('show', function() {
			console.log('sidebar-show:左侧栏显示')
		})
		this._sidePanel.on('hide', function() {
			console.log('sidebar-hide:左侧栏隐藏')
		})
		setTimeout(function() {
			sidePanel.syncTitleBar()
		}, 500)

	}



	/**
	 * 获得实例
	 */
	get() {
		return this._sidePanel
	}



	/**
	 * 获取一下mainWindow的位置信息并同步一下sidePanel，不包含焦点处理
	 */
	syncSize(resetY = 0) {
		function isWin11() {
			var sysVersion = process.getSystemVersion()
			if (sysVersion.startsWith('10.') && process.platform == 'win32') {
				return true
			} else {
				return false
			}
		}
		var isWin11 = isWin11()
		if (!SidePanel.alive()) return
		if (mainWindow == null || sidePanel == null) {
			return
		}
		if (!mainWindow.isVisible()) {
			//如果mainWindow本身不可见，则不做吸附操作
			return
		}
		this.bounds = mainWindow.getBounds()

		console.log(process.getSystemVersion())


		//windows全屏模式单独处理
		if (mainWindow.isMaximized() && process.platform == 'win32') {
			//win上x和y在全屏下不为0，甚至为-8，目前未考虑win7
			if (this.bounds.x < 0) this.bounds.x = 0
			if (this.bounds.y < 0) {
				this.bounds.y = 0
			}
			if (settings.get('useSeparateTitlebar')) {
				this.bounds.y += 23
				this.bounds.height -= 40
			} else {
				if (isWin11) {
					this.bounds.height -= 15 //单独对win11的标题栏高度进行兼容
				} else {
					this.bounds.height -= 20
				}
			}
		} else if (settings.get('useSeparateTitlebar') && process.platform == 'win32') {
			//win上带标题栏的单独处理
			this.bounds.x += 8
			this.bounds.y += 31
			this.bounds.height -= 40
		}

		let setX = this.bounds.x
		let setY = !resetY ? this.bounds.y + this.titlebarHeight : this.bounds.y + resetY
		let setHeight = this.bounds.height - this.titlebarHeight
		if (isWin11) {
			//win11的高度不一致
			setX += 1
			setHeight -= 1
		}
		this._sidePanel.setBounds({
			x: setX,
			y: setY,
			width: this.panelWidth,
			height: setHeight
		})
	}

	setTop() {
		// if (SidePanel.alive())
		// 	this._sidePanel.setAlwaysOnTop(true, 'status')
	}

	unsetTop() {
		// if (SidePanel.alive())
		// 	this._sidePanel.setAlwaysOnTop(false)
	}



	/**
	 * 挂载全部的mainWindow事件以修正sidebar的位置
	 */



	show() {
		if (SidePanel.alive()) {
			if (!this._sidePanel.isVisible() && this._sidePanel != null) {
				console.log('调用sidebar.show()侧边栏')
				this._sidePanel.show()
			}
		}

	}
	hide() {
		if (SidePanel.alive()) {
			console.log('调用sidebar.hide()侧边栏')
			this._sidePanel.hide()
		}
	}

	focus() {
		if (SidePanel.alive()) {
			console.log('调用sidebar.focus()侧边栏')
			this._sidePanel.focus()
		}
	}

	setIgnoreMouseEvents(args) {
		if (SidePanel.alive()) {
			this._sidePanel.setIgnoreMouseEvents(args)
		}
	}

	close() {
		if (SidePanel.alive()) {
			console.log('调用sidebar.close()主动close')
			this._sidePanel.close()
			sidePanel = null
			this._sidePanel = null
		}

	}

	addItem(item) {

		let defaultItem = {
			title: '', //名称，用于显示提示
			name: '',
			index: 0, //索引组
			id: 0, //任务id
			icon: '', //图标
			draggable: true, //是否允许拖拽
			ext: '', //额外的信息，如果是任务则放任务id
			fixed: false,
			type: 'task', //task fav
			tabs: [], //初始化的时候必要用于展示的有就行了，其他的会自动同步过去
			count: 0
		}

		let addItem = Object.assign({}, defaultItem, item)

		if (this._sidePanel != null) {
			this._sidePanel.webContents.send('addItem', {
				item: addItem
			})
			console.log(addItem)
		}

	}
	syncTitleBar() {
		sendIPCToWindow(mainWindow, 'getTitlebarHeight')
	}

	//设置在侧边栏鼠标无效
	setMouseIgnore() {
		this._sidePanel.setIgnoreMouseEvents(true, {
			forward: true
		})
		mainWindow.focus()
		console.log('设置左侧栏不再感应鼠标，主窗体获得焦点')
	}
	//设置在侧边栏鼠标有效
	setMouseEnable() {
		this._sidePanel.setIgnoreMouseEvents(false)
		this._sidePanel.focus()
		console.log('设置左侧栏感应 鼠标，左侧栏同时获得焦点')
	}
}


function addMainWindowEventListener() {


	mainWindow.on('move', () => {
		sidePanel.syncSize()
	})

	mainWindow.on('hide', () => {
		if (SidePanel.alive()) {
			//sidePanel.hide()
			console.log('mainwindow-hide:隐藏侧边栏')
		}
	})

	mainWindow.on('show', () => {
		if (SidePanel.alive()) {
			console.log('mainwindow-show:侧边栏' + sidePanel._sidePanel)
			//sidePanel.show()
			//sidePanel.syncSize()
		}

	})

	//当主窗体失去焦点的时候，取消侧边栏的置顶。
	// mainWindow.on('blur', () => {
	// 	if (SidePanel.alive()) {
	// 		if (!sidePanel._sidePanel.isFocused() && !mainWindow.isMinimized()) {
	// 			//sidePanel失去焦点，且mainWindow不是最小化
	// 			if (sidePanel._sidePanel.isAlwaysOnTop()) {
	// 				sidePanel._sidePanel.setAlwaysOnTop(false)
	// 				sidePanel._sidePanel.moveAbove(mainWindow
	// 					.getMediaSourceId()) //移动到父级最前面，不挡住其他的界面，不使用这个办法会突出来
	// 				mainWindow.blur()
	// 			}
	// 			//mainWindow.blur()
	// 			//sidePanel.showInactive()
	// 		}
	// 	}
	//
	// })



	//设置侧边栏全局置顶，不设置的话，移动鼠标上去的话，是无法直接获得焦点，触发其弹窗浮层的效果
	// mainWindow.on('focus', () => {
	// 	if (SidePanel.alive()) {
	// 		if (mainWindow.isVisible()) {
	// 			sidePanel.setTop()
	// 			sidePanel._sidePanel.showInactive()
	// 		}
	// 	}


	// })

	//最小化、恢复事件
	mainWindow.on('minimize', () => {
		if (process.platform == 'win32')
			sidePanel.hide()

	})
	mainWindow.on('restore', () => {
		if (process.platform == 'win32')
			sidePanel.show() //sidePanel.show()
	})

	//最大化，取消最大化事件，一般用于win
	mainWindow.on('maximize', () => {
		console.log('mainwindow-maximize:')
		sidePanel.syncSize()
		sidePanel.syncTitleBar()
		sidePanel.show() //最大化情况下，最小化，再恢复窗体，必须要重新show一下，不然无法点击左侧栏
	})
	mainWindow.on('unmaximize', () => {
		console.log('mainwindow-unmaximize:')
		sidePanel.syncSize()
		sidePanel.syncTitleBar()
		//sendIPCToWindow(mainWindow, 'getTitlebarHeight')
	})


	//进入退出全屏事件
	mainWindow.on('enter-full-screen', () => {
		console.log('mainwindow-enter-full-screen:进入全屏')
		//sidePanel.syncSize()
		//windows上全屏少了一块区域
		//sidePanel.syncTitleBar()
		// this.sidePanel.setAlwaysOnTop(true, 'floating')
	})
	mainWindow.on('leave-full-screen', () => {
		console.log('mainwindow-leave-full-screen:进入全屏')
		sidePanel.syncSize()
		//sidePanel.setTop()
		sidePanel.syncTitleBar() //sendIPCToWindow(mainWindow, 'getTitlebarHeight')

	})

	//进入退出html全屏，一般用于视频播放的时候
	mainWindow.on('enter-html-full-screen', () => {
		sidePanel.hide()
	})
	mainWindow.on('leave-html-full-screen', () => {
		//sidePanel.show()
		setTimeout(function() {
			sidePanel.show()
			mainWindow.focus()
		}, 750)


	})


	mainWindow.on('resize', function(event, newBounds, details) {
		console.log('mainwindow-resize:调整尺寸')
		sidePanel.syncSize()
	})
	mainWindow.on('close', function() {
		console.log('mainwindow-close:关闭')
		sidePanel.close()
	})

}


function loadSidePanel() {
	sidePanel = new SidePanel()
	sidePanel.init()
}





// //用于viewManager回调，以使sidebar配合显示
// function onSetView() {
// 	if (SidePanel.alive())
// 		sidePanel.show()

// }
// //用于viewManager回调，以使sidebar配合隐藏
// function onHideCurrentView() {
// 	if (SidePanel.alive())
// 		sidePanel.hide()
// }

// ipc.on('set-ignore-mouse-events', (event, ...args) => {
// 	if (SidePanel.alive()) {
// 		if (mainWindow.isFocused() || sidePanel._sidePanel.isFocused()) {
// 			if (args[0]) {
// 				mainWindow.focus()
// 			} else {
// 				sidePanel.focus()
// 			}
// 			if (sidePanel._sidePanel.isVisible()) {
// 				console.log(args)
// 				 if (args[0]) {
// 				 	sidePanel.setMouseIgnore()
// 				 } else {
// 				 	sidePanel.setMouseEnable()
// 				 }

// 				//sidePanel.setIgnoreMouseEvents(...args)
// 			}

// 		}
// 	}
// })
ipc.on('setMouseEnable', function() {
	if (SidePanel.alive())
		sidePanel.setMouseEnable()
})
ipc.on('setMouseIgnore', function() {
	if (SidePanel.alive())
		sidePanel.setMouseIgnore()
})

//主窗口收到要获取全局变量的消息，主要是返回tasks和tabs两个数组，用于同步左侧栏
ipc.on('getGlobal', () => {
	//sidebar发来的消息
	if (mainWindow)
		sendIPCToWindow(mainWindow, 'getGlobal')
})

//ipc从mainWindow得到全局变量后，返回给sidebar
ipc.on('receiveGlobal', function(event, data) {
	if (sidePanel != null && mainWindow != null) {
		data.mainWindowId = mainWindow.webContents.id
		sidePanel.get().webContents.send('receiveGlobal', data)
	}
})

//显示书签的时候，将sidepanel隐藏起来
ipc.on('showBookmarks', function() {
	sidePanel.hide()
})
ipc.on('openSetting', function() {
	sendIPCToWindow(mainWindow, 'addTab', {
		url: 'file://' + __dirname + '/pages/settings/index.html'
	})
})

ipc.on('openHome', function() {
	sendIPCToWindow(mainWindow, 'openApps')
})

ipc.on('openHelp', function() {
	sendIPCToWindow(mainWindow, 'addTab', {
		url: 'https://www.yuque.com/tswork/ngd5zk'
	})
})

ipc.on('openMobile', function() {
	sendIPCToWindow(mainWindow, 'openMobile')
})

ipc.on('hideSidePanel', function() {
	if (SidePanel.alive()) {
		sidePanel.hide()
	}

})

ipc.on('returnTitlebarHeight', function(event, data) {
	if (data.titlebarHeight && sidePanel != null) {
		sidePanel.titlebarHeight = data.titlebarHeight
		sidePanel.syncSize()
	}
})

var count = 0
ipc.on('showSidePanel', function() {
	if (SidePanel.alive()) {
		sidePanel.show()
	}
})

var selectTaskWindow = null
ipc.on('selectTask', function() {
	selectTaskWindow = new BrowserWindow({
		frame: true,
		backgroundColor: 'black',
		parent: mainWindow,
		modal: true,
		hasShadow: true,
		width: 1000,
		autoHideMenuBar: true,
		height: 700,
		resizable: false,
		acceptFirstMouse: true,
		visualEffectState: 'active',
		webPreferences: {
			preload: path.join(__dirname, '/pages/selectTask/preload.js'),
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
	selectTaskWindow.webContents.loadURL('file://' + __dirname + "/pages/selectTask/index.html")

})

ipc.on('closeTaskSelect', function() {
	selectTaskWindow.close()
})

ipc.on('addTab', function(event, data) {
	sendIPCToWindow(mainWindow, 'addTab', {
		'url': data.url
	})
})

ipc.on('userLogin', function(event, data) {
	sidePanel.get().webContents.send( 'userLogin', {
		'userInfo': data.userInfo
	})
})
