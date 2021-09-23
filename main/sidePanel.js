class SidePanel {
	sidePanel = {}
	titlebarHeight = 36
	panelWidth = 400
	mainViewBounds = {}
	isStandalone = false //是否是独立
	constructor() {
		this.mainViewBounds = mainWindow.getBounds()
	}
	/**
	 * 初始化sidePanel并载入、设置好位置
	 */
	init() {
		this.sidePanel = new BrowserWindow({
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
			}
		})
		if (process.platform == 'win32') {
			this.titlebarHeight = 48
		}
		this.sidePanel.webContents.loadURL('file://' + __dirname + "/pages/sidebar/sidebar.html")
		//windows上首次载入就要设置一下位置
		this.attachToMainWindow()
		this.setTop()
		this.sidePanel.hide()
		this.addMainWindowEventListener()
	}

	/**
	 * 获得实例
	 */
	get() {
		return this.sidePanel
	}


	/**
	 * 返回sidePanel实例
	 */
	static getSidePanel() {
		return this.sidePanel
	}
	/**
	 * 获取一下mainWindow的位置信息并同步一下sidePanel，不包含焦点处理
	 */
	attachToMainWindow() {
		if (!mainWindow.isVisible()) {
			//如果mainWindow本身不可见，则不做吸附操作
			return
		}
		this.bounds = mainWindow.getBounds()
		this.sidePanel.setBounds({
			x: this.bounds.x,
			y: this.bounds.y + this.titlebarHeight,
			width: this.panelWidth,
			height: this.bounds.height - this.titlebarHeight
		})
	}
	setTop() {
		this.sidePanel.setAlwaysOnTop(true, 'status')
	}

	unsetTop() {
		this.sidePanel.setAlwaysOnTop(false)
	}
	/**
	 * 挂载全部的mainWindow事件以修正sidebar的位置
	 */
	addMainWindowEventListener() {



		mainWindow.on('move', () => {
			this.attachToMainWindow()
		})

		mainWindow.on('show', () => {
			this.attachToMainWindow()
		})

		//当主窗体失去焦点的时候，取消侧边栏的置顶。
		mainWindow.on('blur', () => {
			if (this.sidePanel != {} && !this.sidePanel.isFocused() && !mainWindow.isMinimized()) {
				this.sidePanel.setAlwaysOnTop(false)
				this.sidePanel.moveAbove(mainWindow.getMediaSourceId()) //移动到父级最前面，不挡住其他的界面，不使用这个办法会突出来
				//mainWindow.blur()
				//sidePanel.showInactive()
			}
		})

		//设置侧边栏全局置顶，不设置的话，移动鼠标上去的话，是无法直接获得焦点，触发其弹窗浮层的效果
		mainWindow.on('focus', () => {

			if (this.sidePanel != {} && mainWindow.isVisible()) {
				this.setTop()
			}
			this.sidePanel.showInactive()
		})

		mainWindow.on('maximize', () => {
			this.attachToMainWindow()

		})

		mainWindow.on('unmaximize', () => {
			this.attachToMainWindow()
		})

		mainWindow.on('enter-full-screen', () => {
			this.attachToMainWindow()
			// this.sidePanel.setAlwaysOnTop(true, 'floating')
		})
		mainWindow.on('leave-full-screen', () => {
			this.attachToMainWindow()
			this.setTop()
		})
	}


	show() {

		if (!this.sidePanel.isVisible() && this.sidePanel != {}) {
			this.sidePanel.showInactive()
		}
	}
	hide() {
		if (this.sidePanel != {}) {
			this.sidePanel.hide()
		}
	}

	focus() {
		this.sidePanel.focus()
	}

	setIgnoreMouseEvents(args) {
		this.sidePanel.setIgnoreMouseEvents(args)
	}

}

function addMainWindowListen() {
	mainWindow.on('will-resize', function(event, newBounds, details) {
		sidePanel.get().setBounds({
			x: newBounds.x,
			y: newBounds.y + sidePanel.titlebarHeight,
			width: sidePanel.panelWidth,
			height: newBounds.height - sidePanel.titlebarHeight
		})
		sidePanel.bounds = newBounds
	})
}

let sidePanel = {}


function loadSidePanel() {
	sidePanel = new SidePanel()
	sidePanel.init()
}






//用于viewManager回调，以使sidebar配合显示
function onSetView() {
	sidePanel.show()
}
//用于viewManager回调，以使sidebar配合隐藏
function onHideCurrentView() {
	sidePanel.hide()
}

ipc.on('set-ignore-mouse-events', (event, ...args) => {
	if (args) {
		mainWindow.focus()
	} else {
		sidePanel.focus()
	}
	sidePanel.setIgnoreMouseEvents(...args)
})
//主窗口收到要获取全局变量的消息，主要是返回tasks和tabs两个数组，用于同步左侧栏
ipc.on('getGlobal', () => {
	//sidebar发来的消息
	sendIPCToWindow(mainWindow, 'getGlobal')
})

//ipc从mainWindow得到全局变量后，返回给sidebar
ipc.on('receiveGlobal', function(event, data) {
	data.mainWindowId = mainWindow.webContents.id
	sidePanel.get().webContents.send('receiveGlobal', data)
})
