var sidebarView = null
var mainBrowserView = null //主窗体
function loadSidebar(){
	
	createSideBarView(mainWindow)
	//设置主view
	
	mainWindow.setMainView = (view) => {
		mainWindow.setBrowserView(sidebarView)
		mainWindow.addBrowserView(view)
		mainBrowserView = view
		//console.log(view.webContents.URL)
	}
	
	//取回主view
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
function createSideBarView(mainWindow) {
	const defaultViewWebPreferences = {
		nodeIntegration: true,

		preload: path.join(__dirname, '/pages/sidebar/sidebarPreload.js'),

	}
	sidebarView = new BrowserView({
		webPreferences: defaultViewWebPreferences
	})
	//mainWindow.setBrowserView(view)



	//mainWindow.setTopBrowserView(view)
	sidebarView.webContents.loadURL('file://' + __dirname + "/pages/sidebar/sidebar.html")
	mainWindow.addBrowserView(sidebarView)
	//sidebarView.setBounds({ x: 0, y: 0, width: 200, height:mainWindow.getBounds().height })
	sidebarView.setBackgroundColor('#00000000')
	sidebarView.webContents.openDevTools()

}



//主窗口收到要获取全局变量的消息
ipc.on('getGlobal', () => {
	sendIPCToWindow(mainWindow, 'getGlobal')
})


ipc.on('receiveGlobal', function(event, data) {
	data.mainWindowId = mainWindow.webContents.id
	sidebarView.webContents.send('receiveGlobal', data)
})
