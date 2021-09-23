let sidePanel = null
class SidePanel {
	_sidePanel = null
	titlebarHeight = 20
	panelWidth = 400
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
		} else if (sidePanel.isDestroyed()) {
			return false
		}
		return true
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
			}
		})
		// if (process.platform == 'win32') {
		// 	this.titlebarHeight = 48
		// }
		this._sidePanel.webContents.loadURL('file://' + __dirname + "/pages/sidebar/sidebar.html")
		//windows上首次载入就要设置一下位置
		this.attachToMainWindow()
		this.setTop()
		this._sidePanel.hide()
		let that=this
		//左侧栏和主界面都失去焦点的时候，取消掉自身的置顶，以防止捅破别的地方
		this._sidePanel.on('blur',function(){
			if(!mainWindow.isFocused()){
				that.unsetTop()
			}
		})
		setTimeout(function(){
			sendIPCToWindow(mainWindow,'getTitlebarHeight')
		},500)

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
	attachToMainWindow(resetY=0) {
		if (!SidePanel.alive()) return
		if (mainWindow == null || sidePanel == null) {
			return
		}
		if (!mainWindow.isVisible()) {
			//如果mainWindow本身不可见，则不做吸附操作
			return
		}
		this.bounds = mainWindow.getBounds()
	
		//windows全屏模式单独处理
		if(mainWindow.isMaximized() && process.platform=='win32')
		{
				if (this.bounds.x<0) this.bounds.x=0
				if(this.bounds.y<0) this.bounds.y=0
				
				if( settings.get('useSeparateTitlebar')){
					this.bounds.y+=23
					this.bounds.height-=40
				}
				
				//win上带标题栏的单独处理
		}else if(settings.get('useSeparateTitlebar')  && process.platform=='win32'){
			this.bounds.x+=8
			this.bounds.y+=31
			this.bounds.height-=40
		}
		let setX=this.bounds.x
		let setY=!resetY?this.bounds.y + this.titlebarHeight:this.bounds.y+resetY
		this._sidePanel.setBounds({
			x: setX,
			y: setY,
			width: this.panelWidth,
			height: this.bounds.height - this.titlebarHeight
		})
	}
	
	setTop() {
		if (SidePanel.alive())
			this._sidePanel.setAlwaysOnTop(true, 'status')
	}

	unsetTop() {
		if (SidePanel.alive())
			this._sidePanel.setAlwaysOnTop(false)
	}



	/**
	 * 挂载全部的mainWindow事件以修正sidebar的位置
	 */



	show() {
		if (SidePanel.alive()) {
			if (!this._sidePanel.isVisible() && this._sidePanel != null) {
				this._sidePanel.showInactive()
			}
		}

	}
	hide() {
		if (SidePanel.alive()) {
			this._sidePanel.hide()
		}
	}

	focus() {
		if (SidePanel.alive()) {
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
			this._sidePanel.close()
			sidePanel = null
			this._sidePanel = null
		}

	}

}


function addMainWindowEventListener() {


	mainWindow.on('move', () => {
		sidePanel.attachToMainWindow()
	})

	mainWindow.on('show', () => {
		sidePanel.attachToMainWindow()
	})

	//当主窗体失去焦点的时候，取消侧边栏的置顶。
	mainWindow.on('blur', () => {
		if (sidePanel._sidePanel != null && !sidePanel._sidePanel.isFocused() && !mainWindow.isMinimized()) {
			sidePanel._sidePanel.setAlwaysOnTop(false)
			sidePanel._sidePanel.moveAbove(mainWindow.getMediaSourceId()) //移动到父级最前面，不挡住其他的界面，不使用这个办法会突出来
			//mainWindow.blur()
			//sidePanel.showInactive()
		}
	})

	//设置侧边栏全局置顶，不设置的话，移动鼠标上去的话，是无法直接获得焦点，触发其弹窗浮层的效果
	mainWindow.on('focus', () => {
		if (SidePanel.alive()) {
			if (mainWindow.isVisible()) {
				sidePanel.setTop()
				sidePanel._sidePanel.showInactive()
			}
		}


	})

	mainWindow.on('maximize', () => {
		sidePanel.attachToMainWindow()
		sendIPCToWindow(mainWindow, 'getTitlebarHeight')
	})

	mainWindow.on('unmaximize', () => {
		sidePanel.attachToMainWindow()
		sendIPCToWindow(mainWindow,'getTitlebarHeight')
	})

	mainWindow.on('enter-full-screen', () => {
		sidePanel.attachToMainWindow()
		//windows上全屏少了一块区域
		sendIPCToWindow(mainWindow,'getTitlebarHeight')
		// this.sidePanel.setAlwaysOnTop(true, 'floating')
	})
	mainWindow.on('leave-full-screen', () => {
		sidePanel.attachToMainWindow()
		sidePanel.setTop()
		sendIPCToWindow(mainWindow,'getTitlebarHeight')
		
	})
	mainWindow.on('resize', function(event, newBounds, details) {
		sidePanel.attachToMainWindow()
	})
	mainWindow.on('close', function() {
		sidePanel.close()

	})

}


let resizeTag = true

// function addMainWindowListen() {
// 	mainWindow.on('resize', function(event, newBounds, details) {
// 		sidePanel.attachToMainWindow()
// 	})
// }




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
	if (mainWindow.isFocused() || sidePanel._sidePanel.isFocused()) {
		if (args[0]) {
			mainWindow.focus()
		} else {
			sidePanel.focus()
		}
		if (sidePanel._sidePanel.isVisible())
			sidePanel.setIgnoreMouseEvents(...args)
	}

})
//主窗口收到要获取全局变量的消息，主要是返回tasks和tabs两个数组，用于同步左侧栏
ipc.on('getGlobal', () => {
	//sidebar发来的消息
	if (mainWindow)
		sendIPCToWindow(mainWindow, 'getGlobal')
})

//ipc从mainWindow得到全局变量后，返回给sidebar
ipc.on('receiveGlobal', function(event, data) {
	data.mainWindowId = mainWindow.webContents.id
	sidePanel.get().webContents.send('receiveGlobal', data)
})

//显示书签的时候，将sidepanel隐藏起来
ipc.on('showBookmarks', function() {
	sidePanel.hide()
})
