window.globalArgs = {}

process.argv.forEach(function(arg) {
	if (arg.startsWith('--')) {
		var key = arg.split('=')[0].replace('--', '')
		var value = arg.split('=')[1]
		globalArgs[key] = value
	}
})

window.electron = require('electron')
window.fs = require('fs')
window.EventEmitter = require('events')
window.ipc = electron.ipcRenderer
window.Dexie = require('dexie')


if (navigator.platform === 'MacIntel') {
	document.body.classList.add('mac')
	window.platformType = 'mac'
} else if (navigator.platform === 'Win32') {
	document.body.classList.add('windows')
	window.platformType = 'windows'
} else {
	document.body.classList.add('linux')
	window.platformType = 'linux'
}

if (navigator.maxTouchPoints > 0) {
	document.body.classList.add('touch')
}

/* add classes so that the window state can be used in CSS */
ipc.on('enter-full-screen', function() {
	document.body.classList.add('fullscreen')
})

ipc.on('leave-full-screen', function() {
	document.body.classList.remove('fullscreen')
})

ipc.on('maximize', function() {
	document.body.classList.add('maximized')
})

ipc.on('unmaximize', function() {
	document.body.classList.remove('maximized')
})

// https://remysharp.com/2010/07/21/throttling-function-calls

window.throttle = function(fn, threshhold, scope) {
	threshhold || (threshhold = 250)
	var last,
		deferTimer
	return function() {
		var context = scope || this

		var now = +new Date()
		var args = arguments
		if (last && now < last + threshhold) {
			// hold on to it
			clearTimeout(deferTimer)
			deferTimer = setTimeout(function() {
				last = now
				fn.apply(context, args)
			}, threshhold)
		} else {
			last = now
			fn.apply(context, args)
		}
	}
}

// https://remysharp.com/2010/07/21/throttling-function-calls

window.debounce = function(fn, delay) {
	var timer = null
	return function() {
		var context = this
		var args = arguments
		clearTimeout(timer)
		timer = setTimeout(function() {
			fn.apply(context, args)
		}, delay)
	}
}

window.empty = function(node) {
	var n
	while (n = node.firstElementChild) {
		node.removeChild(n)
	}
}

/* prevent a click event from firing after dragging the window */

window.addEventListener('load', function() {
	var isMouseDown = false
	var isDragging = false
	var distance = 0

	document.body.addEventListener('mousedown', function() {
		isMouseDown = true
		isDragging = false
		distance = 0
	})

	document.body.addEventListener('mouseup', function() {
		isMouseDown = false
	})

	var dragHandles = document.getElementsByClassName('windowDragHandle')

	for (var i = 0; i < dragHandles.length; i++) {
		dragHandles[i].addEventListener('mousemove', function(e) {
			if (isMouseDown) {
				isDragging = true
				distance += Math.abs(e.movementX) + Math.abs(e.movementY)
			}
		})
	}

	document.body.addEventListener('click', function(e) {
		if (isDragging && distance >= 10.0) {
			e.stopImmediatePropagation()
			isDragging = false
		}
	}, true)
})



require('tabState.js').initialize()
require('windowControls.js').initialize()
require('navbar/menuButton.js').initialize()

require('navbar/addTabButton.js').initialize()
require('navbar/tabActivity.js').initialize()
require('navbar/tabColor.js').initialize()
require('navbar/navigationButtons.js').initialize()



require('downloadManager.js').initialize()
require('webviewMenu.js').initialize()
require('contextMenu.js').initialize()
require('menuRenderer.js').initialize()
require('defaultKeybindings.js').initialize()
require('pdfViewer.js').initialize()
require('autofillSetup.js').initialize()
require('passwordManager/passwordManager.js').initialize()
require('passwordManager/passwordCapture.js').initialize()
require('passwordManager/passwordViewer.js').initialize()
require('util/theme.js').initialize()
require('userscripts.js').initialize()
require('statistics.js').initialize()
require('taskOverlay/taskOverlay.js').initialize()
require('pageTranslations.js').initialize()
require('sessionRestore.js').initialize()

// default searchbar plugins

require('searchbar/placesPlugin.js').initialize()
require('searchbar/instantAnswerPlugin.js').initialize()
require('searchbar/openTabsPlugin.js').initialize()
require('searchbar/bangsPlugin.js').initialize()
require('searchbar/customBangs.js').initialize()
require('searchbar/searchSuggestionsPlugin.js').initialize()
require('searchbar/placeSuggestionsPlugin.js').initialize()
require('searchbar/updateNotifications.js').initialize()
require('searchbar/restoreTaskPlugin.js').initialize()
require('searchbar/bookmarkManager.js').initialize()
require('searchbar/historyViewer.js').initialize()
require('searchbar/developmentModeNotification.js').initialize()
require('searchbar/shortcutButtons.js').initialize()
require('searchbar/calculatorPlugin.js').initialize()
window.browserUI = require('browserUI.js')
// once everything's loaded, start the session
require('sessionRestore.js').restore()
var tabEditor = require('navbar/tabEditor.js')
require('sidebarComp.js')
window.onload = function() {
	Vue.prototype.$window = window

	Vue.use(Vuex)
	const store = new Vuex.Store({
		state: {
			pinItems: [], //置顶区域的items，横线上方部分
			items: [] //普通区域的items
		},
		getters: {
			//将任务填充到item列表当中，系统会自动刷新一次列表。
			//算法主要是遍历两个组，然后将task按顺序填充进去，如果有多的，就在队列尾部插入（应对插入新组的情况），如果有少的，则从队尾删除相应数量（应对删除任务的情况）
			fillTasksToItems: state => {
				//将tasks转化为items
				let replaceIndex = 0
				//遍历置顶的区域，把任务都替换进来
				state.pinItems.forEach(function(pinItem, indexPin) {
					if (pinItem.type == "task") {
						console.log(tasks.get(replaceIndex))
						state.pinItems[indexPin] = store.getters.getItemFromTask(tasks.byIndex(
							replaceIndex))
						replaceIndex++
					}

				});
				
				//遍历非置顶区域，把任务都替换进来
				state.items.forEach(function(item, index) {
					if (item.type == "task") {
						//如果现存的任务都替换进去了，接下来就不是再替换了，而是删除掉剩余的task，以保持两边同步
						if (replaceIndex >= tasks.getLength()) {
							state.items.splice(index, 1)
						} else {
							state.items[index] = store.getters.getItemFromTask(tasks.byIndex(
							replaceIndex))
							replaceIndex++
						}

					}

				});
				//如果到最后，还有没替换的，就在队尾插入剩余的任务
				let last = tasks.getLength() - replaceIndex
				if (last > 0) {
					//如果有剩下的，就往数组最后添加上
					for (let i = 0; i < last; i++) {
						state.items.push(store.getters.getItemFromTask(tasks.byIndex(replaceIndex)))
						replaceIndex++
					}
				} 


				//返回最终的侧边栏项目
				let result = {
					'pinItems': state.pinItems,
					'items': state.items
				}
				return result
				
			},
			//获取全部的item，包括置顶和非置顶的部分
			getItems: state => {
				return {
					'pinItems': state.pinItems,
					'items': state.items
				}
			},
			//获取单个item的标题，自动处理无分组名的情况，支持语言包
			getItemTitle: (state) => (task) => {
				//如果标签没名字，就给它取个默认名字
				if (task.name == null) {
					return l('defaultTaskName').replace('%n', tasks.getIndex(task.id) + 1)
				} else {
					return task.name
				}
			},
			//获取任务的icon
			getItemIcon: (state) => (task) => {
				if (task.tabs.count() == 0) {
					return "icons/empty.png"
				}
				let favicon = task.tabs.getAtIndex(0).favicon;

				if (typeof favicon == 'undefined') {
					return "icons/empty.png"
				} else if (typeof favicon == 'undefined') {
					return "icons/empty.png"
				} else if (favicon == null) {
					return "icons/empty.png"
				} else {
					return favicon.url
				}

			},
			//从任务转化出一个item，用于items列表
			getItemFromTask: (state) => (task) => {
				let parsedTitle = store.getters.getItemTitle(task)
				let parsedIcon = store.getters.getItemIcon(task)
				let item = {
					title: parsedTitle, //名称，用于显示提示
					name: parsedTitle,
					index: task.index, //索引组
					id: task.id, //任务id
					icon: parsedIcon, //图标
					draggable: true, //是否允许拖拽
					ext: task.id, //额外的信息
					fixed: false,
					type: 'task'
				}
				return item
			}

		},
		mutations: {
			//设置置顶区域的item
			savePinItems(state, pinItems) {
				//将根据pin和items生成Tasks
				state.pinItems = pinItems
			},
			//设置item
			saveItems(state, items) {
				state.items = items
			},

			//从任务组读入置顶区域，目前还不支持存档，每次进去会重新填充一次
			initItems: state => {
			
				//在置顶区域插入一个收藏夹的图标按钮
				let item = {
					title: '收藏夹', //名称，用于显示提示
					index: 0, //索引
					id: 1, //id
					icon: "icons/fav.png", //图标
					draggable: true, //是否允许拖拽
					ext: '', //额外的信息
					fixed: true, //锁定，不让它移动
					type: 'system-bookmark'
				}
				state.pinItems.push(item)
				if (tasks != null) {
					//从任务当中取得任务的小组
					let tasksArray = tasks.getAll()
					let that = this
					tasks.forEach(function(task, index) {
						let item = store.getters.getItemFromTask(task)

						state.items.push(item)
					})
				}
			}

		}
	})


	Vue.prototype.$sidebarItems = window.sidebarItems
	Vue.prototype.$tabEditor = tabEditor

	Vue.config.devtools = true
	var app = new Vue({
		el: '#app',
		store: store,
		components: {
			vuedraggable
		},
		data: {
			message: 'Hello Vue!',
			window: window
		},
		mounted:function(){
			window.$store=store
			var webviews = require('webviews.js')
			webviews.bindEvent('did-navigate', function (tabId, color) {
			  window.$store.getters.fillTasksToItems
			})
			
		}
	})
	
	
	

}
