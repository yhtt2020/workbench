var browserUI = require('browserUI.js')
aList = getList()

function initialize() {
	window.addEventListener('load', function() {
		let body = document.body;
		refreshAll()
	})
}

function getList() {
	return document.getElementById("appGroup")
}

function refreshAll() {

	//对分组进行遍历
	tasks.forEach(function(task, index) {
		
			//根据分组第一个网站创建一个图标
			let img = document.createElement("img");
			let favicon = task.tabs.getAtIndex(0).favicon
			console.log(task)
			if(typeof favicon == 'undefined'){
				img.setAttribute('src', "icons/empty.png")
			}else if(typeof favicon =='undefined'){
				img.setAttribute('src', "icons/empty.png")
			}else if(favicon ==null){
				img.setAttribute('src', "icons/empty.png")
			}else{
				img.setAttribute('src', favicon.url)
			}
			
			
			// if (typeof(favicon.url)!='string') {
			// 	img.setAttribute('src', "icons/empty.png")
			// } else {
			// 	img.setAttribute('src', favicon.url)
			// }

			img.setAttribute('class', 'icon')
			//将图标放到li当中
			let li = document.createElement('li')
			li.setAttribute('data-role', 'task')
			li.setAttribute('class', 'openTask')
			li.setAttribute('task-id', task.id)
			//如果标签没名字，就给它取个默认名字
			if (task.name == null) {
				li.setAttribute('title', l('defaultTaskName').replace('%n', index + 1))
			}

			li.appendChild(img)
			li.appendChild(img)
			li.onclick = function(e) {
				let taskId = e.currentTarget.getAttribute('task-id');
				console.log(e.currentTarget)
				console.log(taskId)
				browserUI.switchToTask(taskId)
			}
			aList.appendChild(li)
		

	})

}

// for (let i in aList) {
// 	aList[i].onclick = function(e) {
// 		searchbar.openURL('http://www.baidu.com', e)
// 	}
// }



module.exports = {
	initialize,
	refreshAll
}
