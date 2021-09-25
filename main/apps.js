ipc.on('addTask',function(event, data){
	sendIPCToWindow(mainWindow,'addTaskFromApps',{name:data.name,url:data.url})
})