ipc.on('addTask',function(event, data){
	let taskId=Math.round(Math.random() * 100000000000000000)
	let item={
		title: data.name, //名称，用于显示提示
		name: data.name,
		index: 0, //索引组
		id: taskId, //任务id
		icon: data.icon, //图标
		draggable: true, //是否允许拖拽
		ext: taskId, //额外的信息，如果是任务则放任务id
		fixed: false,
		type: 'task',//task fav
		tabs: [],//初始化的时候必要用于展示的有就行了，其他的会自动同步过去
		count:1
	}
	if(sidePanel!=null)
		sidePanel.addItem(item)
	sendIPCToWindow(mainWindow,'addTaskFromApps',{id:taskId,name:data.name,url:data.url})
})

ipc.on('addNewTask',function(){
  sendIPCToWindow(mainWindow,'addTask')
})
