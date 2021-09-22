let titlebarHeight = 36
let panelWidth = 400
let sidePanel = {}

function loadSidePanel() {
	const {
		BrowserWindow
	} = require('electron')

	let bounds = mainWindow.getBounds()
	sidePanel = new BrowserWindow({
		transparent: true,
		frame: false,
		parent: mainWindow,
		hasShadow: false,
		width: 200,
		height: bounds.height - titlebarHeight,
		resizable: false,
		acceptFirstMouse: true,
		roundedCorners: false,
		visualEffectState: 'active',
		webPreferences: {
			preload: path.join(__dirname, '/pages/sidebar/sidebarPreload.js'),
			nodeIntegration: true,
		}

	})
	sidePanel.webContents.loadURL('file://' + __dirname + "/pages/sidebar/sidebar.html")
	sidePanel.show()
	//如果不舍为置顶，鼠标移动进去不会触发悬浮窗，必须点一下才能有反应。
	sidePanel.setAlwaysOnTop(true, 'status')
	//sidePanel.webContents.openDevTools()
	mainWindow.on('will-resize', function(event, newBounds, details) {
		sidePanel.setBounds({
			x: newBounds.x,
			y: newBounds.y + titlebarHeight,
			width: panelWidth,
			height: newBounds.height - titlebarHeight
		})
		bounds = newBounds
	})

	mainWindow.on('move', () => {
		bounds = mainWindow.getBounds()
		sidePanel.setBounds({
			x: bounds.x,
			y: bounds.y + titlebarHeight,
			width: panelWidth,
			height: bounds.height - titlebarHeight
		})
	})

	mainWindow.on('show', () => {
		sidePanel.setBounds({
			x: bounds.x,
			y: bounds.y + titlebarHeight,
			width: panelWidth,
			height: bounds.height - titlebarHeight
		})
	})

	//当主窗体失去焦点的时候，取消侧边栏的置顶。
	mainWindow.on('blur', () => {
		if (sidePanel != {} && !sidePanel.isFocused() && !mainWindow.isMinimized()) {
			sidePanel.setAlwaysOnTop(false)
			sidePanel.moveAbove(mainWindow.getMediaSourceId()) //移动到父级最前面，不挡住其他的界面，不使用这个办法会突出来
			//mainWindow.blur()
			//sidePanel.showInactive()
		}
	})

	//设置侧边栏全局置顶，不设置的话，移动鼠标上去的话，是无法直接获得焦点，触发其弹窗浮层的效果
	mainWindow.on('focus', () => {

		if (sidePanel != {} && mainWindow.isVisible())
		 {
			 sidePanel.setAlwaysOnTop(true, 'status')
		 }
		sidePanel.showInactive()
	})

	mainWindow.on('maximize', () => {
		bounds = mainWindow.getBounds()
		sidePanel.setBounds({
			x: 0,
			y: 0 + titlebarHeight,
			width: panelWidth,
			height: bounds.height - titlebarHeight
		})
	})
	
	mainWindow.on('unmaximize', () => {
		bounds = mainWindow.getBounds()
		sidePanel.setBounds({
			x: 0,
			y: 0 + titlebarHeight,
			width: panelWidth,
			height: bounds.height - titlebarHeight
		})
	})
	
	mainWindow.on('enter-full-screen', () => {
		bounds = mainWindow.getBounds()
		sidePanel.setBounds({
			x: 0,
			y: 0 + titlebarHeight,
			width: panelWidth,
			height: bounds.height - titlebarHeight
		})
		sidePanel.setAlwaysOnTop(true, 'floating')
	})
	mainWindow.on('leave-full-screen', () => {
		bounds = mainWindow.getBounds()
		sidePanel.setBounds({
			x: 0,
			y: 0 + titlebarHeight,
			width: panelWidth,
			height: bounds.height - titlebarHeight
		})
		sidePanel.setAlwaysOnTop(true, 'status')
	})
}

// setInterval(function() {
// 	if ()
// }, 1000)


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
	sidePanel.webContents.send('receiveGlobal', data)
})
