//const browserUI= require('./js/browserUI.js')
const remote = require('electron').remote
Vue.component('sidebar', {
	props: {},
	data: function() {
		return {
			tasks: null,
			browserUI: null,

			items: [],
			selectedIndex: -1
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
			that.tasks = tasks
			that.items = tasks.getAll();
			that.browserUI = browserUI


		}, 1000)

	},
	computed: {
		isActive() {
			return (id)=> {
				return {
					active:id == this.tasks.getSelected().id,
				'app-task':true
				}
				
			}
			
		},
		getTitle() {
			return (name, index) => {
				//如果标签没名字，就给它取个默认名字
				if (name == null) {
					return l('defaultTaskName').replace('%n', index + 1)
				}else{
					return name
				}
			}
		},
		getIcon() {
			return task => {
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

			}

		}

	},
	template: `
	<div id="sidebar" style="left:0;height: 100vh;width: 45px;border-right: 1px solid #D7D7D7;">
		<ul id="appGroup" class="app-task">
			<li @click="openTask(task.id,i)" v-for="(task,i) in items" data-role="task" :class="isActive(task.id)" :task-id="task.id" :title="getTitle(task.name,i)">
				<img class="icon" :src="getIcon(task)">
			</li>
		</ul>
	</div>
	`,
	methods: {
		openTask(taskId, index) {
			this.browserUI.switchToTask(taskId)
			this.selectedIndex = index
		}
	},
})
