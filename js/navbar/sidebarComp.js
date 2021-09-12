//const browserUI= require('./js/browserUI.js')
const remote = require('electron').remote
Vue.component('sidebar', {
	props: {},
	data: function() {
		return {
			tasks: null,
			browserUI: null,

			items: []
		}
	},
	mounted: function() {

		// this.$nextTick(() => {
		// 	aList = this.getList()
		// 		console.log(tasks)
		// 	this.tasks = tasks;

		// 	this.refreshAll()
		// })
		let that = this;
		setTimeout(function() {
			aList = that.getList()
			console.log(tasks)
			that.tasks = tasks
			that.items = tasks.getAll();
			that.browserUI = browserUI
			console.log(browserUI)
			//that.refreshAll()

		}, 1000)

	},
	computed: {
		getTitle() {
			return (name, index) => {
				//如果标签没名字，就给它取个默认名字
				if (name == null) {
					return l('defaultTaskName').replace('%n', index + 1)
				}
			}
		},
		getIcon() {
			return task => {
				let favicon= task.tabs.getAtIndex(0).favicon;
				
				if (typeof favicon == 'undefined') {
					return "icons/empty.png"
				} else if (typeof favicon == 'undefined') {
					return "icons/empty.png"
				} else if (favicon == null) {
					return  "icons/empty.png"
				} else {
					return favicon.url
				}
		
			}

		}

	},
	template: `
	<div id="sidebar" style="left:0;height: 100vh;width: 45px;border-right: 1px solid #D7D7D7;">
		<ul id="appGroup" class="app-task">
			<li @click="openTask(task.id)" v-for="(task,i) in items" data-role="task" class="openTask" :task-id="task.id" :title="getTitle(task.name,i)">
				<img class="icon" :src="getIcon(task)">
			</li>
		</ul>
	</div>
	`,
	methods: {
		openTask(taskId){
			this.browserUI.switchToTask(taskId)
		},
		getList: function() {
			return document.getElementById("appGroup")
		},
		refreshAll: function() {

			//对分组进行遍历
			this.tasks.forEach(function(task, index) {

				//根据分组第一个网站创建一个图标
				let img = document.createElement("img");
				let favicon = task.tabs.getAtIndex(0).favicon
				console.log(task)
				if (typeof favicon == 'undefined') {
					img.setAttribute('src', "icons/empty.png")
				} else if (typeof favicon == 'undefined') {
					img.setAttribute('src', "icons/empty.png")
				} else if (favicon == null) {
					img.setAttribute('src', "icons/empty.png")
				} else {
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


				li.appendChild(img)
				li.appendChild(img)
				let that = this;
				li.onclick = function(e) {
					let taskId = e.currentTarget.getAttribute('task-id');
					console.log(e.currentTarget)
					console.log(taskId)

					that.browserUI.switchToTask(taskId)
				}
				aList.appendChild(li)
			})
		}
	},
})
