require('../../dist/localization.build.js')

var electron = require('electron')
var ipc = electron.ipcRenderer
let mainWindowId = 0
window.l = l
const {
	contextBridge
} = require('electron')
//将语言包的接口暴露给里面的页面
window.l = l
window.ipc = ipc
// contextBridge.exposeInMainWorld('l', l)
// contextBridge.exposeInMainWorld('ipc', ipc)

window.addEventListener('message', function(e) {
	if (!e.origin.startsWith('file://')) {
		return
	}
	let messageType = getMessageType(e.data)
	switch (messageType) {
		case 'getGlobal':
			ipc.send('getGlobal')
			break
		case 'openBookMarks':
			ipc.sendTo(mainWindowId, 'showBookmarks') //直传给mainWindow，让它唤出书签页面
			ipc.send('showBookmarks')
			break
			// case 'bringToFront':
			// 	ipc.send('bringSidebarToFront')
			// 	break
			// //case 'bringToBack':
			// 	ipc.send('bringSidebarToBack')
			// 	break
			// case 'bringToBackDelay':
			// 	ipc.send('bringSidebarToBackDelay') //延迟关闭
			// 	break
		case 'switchToTask':
			ipc.sendTo(mainWindowId, 'switchToTask', {
				id: e.data.id,
				index: e.data.index
			})

			break
		case 'resortTasks':
			ipc.sendTo(mainWindowId, 'resortTasks', {
				'droppedTaskId': e.data.droppedTaskId,
				'adjacentTaskId': e.data.adjacentTaskId
			})
			break
		case 'setting':
			ipc.send('openSetting')
			break
		case 'home':
			ipc.send('openHome')
			break
		case 'help':
			ipc.send('openHelp')
			break
		case 'mobile':
			ipc.send('openMobile')
	}


})

let sidebarRestore = require('./sidebarRestore.js').initialize()


function getMessageType(data) {
	if (data && data.message)
		return data.message
	else
		return ''
}
let loaded = window.loaded
setInterval(function() {
	if (loaded === true) {
		ipc.send('getGlobal')
	}
}, 500)

ipc.on('receiveGlobal', function(e, data) {
	window.postMessage({
		message: 'receiveGlobal',
		data: data
	})
	mainWindowId = data.mainWindowId

})

ipc.on('addItem',function(e,data){
	console.log(data)
	window.$store.state.items.push(data.item)
})