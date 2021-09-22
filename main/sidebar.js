/*
sidebar是一个复杂组件，涉及到的机制也比较复杂，对原有的min的机制改动比较大。
建议参考技术文档进行后续的开发， 否则很容易搞坏这个文件。
初始作者：cyx
具体的机制我放到了
https://duanshuo.yuque.com/hfru7g/gta7yy/pnzqq2
可以查阅相关技术文档说明，里面还包含了一张解说主窗体结构的分解图

*/

var sidebarView = null
var mainBrowserView = null //主窗体
var count = 0

function loadSidebar() {

	createSideBarView(mainWindow)

	//设置主view事件，在viewManager中被调用，代理这个操作是为了确保sidebar在browserView的下面
	mainWindow.setMainView = (view) => {
		if (view == null) {
			console.log('setnull')
			if (mainBrowserView != null) {
				mainWindow.removeBrowserView(mainBrowserView)
				mainBrowserView = null
			}

			return
		}
		let haveSidebar = false
		let haveView = false
		mainWindow.getBrowserViews().forEach(function(bw, index) {
			if (bw == view) {
				console.log('haoveview' + count++)
				haveView = true
			} else if (bw == sidebarView) {
				console.log('haovesidebar' + count++)
				haveSidebar == true
			}
		})

		if (haveSidebar == false) //还没有sidebar
		{
			mainWindow.setBrowserView(sidebarView)
			mainWindow.addBrowserView(view)
		} else if (haveSidebar == true && haveView == false) { //有sidebar，但是这个view不是主view，则移除老的view，并将此view放进去
			mainWindow.removeBrowserView(mainBrowserView)
			mainWindow.addBrowserView(view)
			bringSidebarToFront()
		} else if (haveSidebar == true && haveView == true) { //有sidebar，且还存在这个view，直接置顶这个view
			mainWindow.setTopBrowserView(view)
			bringSidebarToFront()
		}
		mainBrowserView = view
		//console.log(view.webContents.URL)
	}

	//取回主view，返回当前被绑定到mainWindow上的主view
	mainWindow.getMainView = () => {
		if (mainWindow.getBrowserViews().length > 1) {
			return mainBrowserView
		} else {
			return mainWindow.getBrowserView()
		}
	}

	mainWindow.getSideBarView = () => {
		return sidebarView
	}
	
	
}

//创建sidebar，创建的时候先不设置位置，实际位置是在viewManager.setBounds里设置的。
function createSideBarView(mainWindow) {
	const defaultViewWebPreferences = {
		nodeIntegration: true,

		preload: path.join(__dirname, '/pages/sidebar/sidebarPreload.js'),

	}
	sidebarView = new BrowserView({
		webPreferences: defaultViewWebPreferences
	})
	sidebarView.webContents.loadURL('file://' + __dirname + "/pages/sidebar/sidebar.html")
	mainWindow.addBrowserView(sidebarView)
	//sidebarView.setBounds({ x: 0, y: 0, width: 200, height:mainWindow.getBounds().height })
	sidebarView.setBackgroundColor('#00000000')
	sidebarView.webContents.openDevTools()

}



//主窗口收到要获取全局变量的消息，主要是返回tasks和tabs两个数组，用于同步左侧栏
ipc.on('getGlobal', () => {
	//sidebar发来的消息
	sendIPCToWindow(mainWindow, 'getGlobal')
})

//ipc从mainWindow得到全局变量后，返回给sidebar
ipc.on('receiveGlobal', function(event, data) {
	data.mainWindowId = mainWindow.webContents.id
	sidebarView.webContents.send('receiveGlobal', data)
})
//设置一个正在fading的变量防抖
let isHiding = false
let isShowing = false
//sidebar鼠标移入的时候要把sidebar尺寸调大，防止显示不全
let shouldHide = false
ipc.on('bringSidebarToFront', function(event) {
	bringSidebarToFront()
})

//sidebar鼠标移出的时候要把sidebar尺寸调回原尺寸，防止遮挡网页
ipc.on('bringSidebarToBack', function(event) {
	sidebarView.setBounds({
		x: 0,
		y: sidebarBounds.y,
		width: 45,
		height: sidebarBounds.height
	})
	mainWindow.setTopBrowserView(mainBrowserView)
})

function bringSidebarToFront() {
	sidebarView.setBounds({
		x: 0,
		y: sidebarBounds.y,
		width: 400,
		height: sidebarBounds.height
	})
	mainWindow.setTopBrowserView(sidebarView)
	//mainWindow.webContents.setIgnoreMouseEvents()
}
