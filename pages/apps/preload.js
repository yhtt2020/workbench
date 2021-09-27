var electron = require('electron')
var ipc = electron.ipcRenderer

window.addEventListener('message', function(e) {
			if (!e.origin.startsWith('file://')) {
				return
			}
			let messageType = getMessageType(e.data)
			switch (messageType) {
				case 'addTask':
					ipc.send('addTask', {
						name: e.data.name,
						url: e.data.url,
						icon:e.data.icon
					})
					break
			}
		})

function getMessageType(data) {
	if (data && data.message)
		return data.message
	else
		return ''
}



let appsRestore = require('./appsRestore.js')
appsRestore.initialize()
window.$appsRestore=appsRestore