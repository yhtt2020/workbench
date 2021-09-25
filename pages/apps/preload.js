window.addEventListener('message', function(e) {
			if (!e.origin.startsWith('file://')) {
				return
			}
			let messageType = getMessageType(e.data)
			switch (messageType) {
				case 'addTask':
					ipc.send('addTask', {
						name: e.data.name,
						url: e.data.url
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