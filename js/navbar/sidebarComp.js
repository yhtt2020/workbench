//const browserUI= require('./js/browserUI.js')
const remote = require('electron').remote
Vue.component('sidebar', {
	props: {},
	data: function() {
		return {
			//暂存来自系统的两个值
			tasks: null,
			browserUI: null,
			//用于渲染组件的数组
			items: [], //置顶的数组
			pinItems: [] ,//下方列表
			
			drag:false
		}
		
	},
	mounted: function() {

		// this.$nextTick(() => {
		// 	aList = this.getList()
		// 		console.log(tasks)
		// 	this.tasks = tasks;

		// 	this.refreshAll()
		// })

		let item = {
			title: '打开标签', //名称，用于显示提示
			index: 0, //索引
			id: "1", //id
			icon: "/icons/fav.png", //图标
			draggable: true, //是否允许拖拽
			ext: '' //额外的信息
		}

		let that = this;
		// this.pinItems.push({
		// 	title: '打开标签',
		// 	id: "1",
		// 	icon: "/icons/fav.png"
		// })
		setTimeout(function() {
			that.tasks = tasks
			that.browserUI = browserUI
		}, 1000)

	},
	computed: {
		getItems() {
			let that = this
			this.items = []
			if (this.tasks != null) {
				//从任务当中取得任务的小组
				let tasksArray = this.tasks.getAll()
				let tasks = this.tasks
				tasks.forEach(function(task, index) {
					let parsedTitle = that.getTitle(task.name, index)
					let parsedIcon = that.getIcon(task)
					let item = {
						title: parsedTitle, //名称，用于显示提示
						name: parsedTitle,
						index: index, //索引组
						id: task.id, //任务id
						icon: parsedIcon, //图标
						draggable: true, //是否允许拖拽
						ext: task.id //额外的信息
					}
					that.items.push(item)

				})
				return this.items
			} else {
				return {}
			}
		},
		getPinItems: {

			get: function() {
				this.pinItems = []
				let item = {
					title: '收藏夹', //名称，用于显示提示
					index: 0, //索引
					id: 1, //id
					icon: "icons/fav.png", //图标
					draggable: true, //是否允许拖拽
					ext: '' //额外的信息
				}
				this.pinItems.push(item)
				return this.pinItems
			},
			// setter
			set: function(newValue) {
				this.pinItems = newValue
				console.log('触发了修改元素')
				console.log(newValue)
			}

		},
		isActive() {
			return (id) => {
				return {
					active: id == this.tasks.getSelected().id,
					'app-task': true
				}

			}

		}

	},
	template: `
	<div id="sidebar" style="left:0;height: 100vh;width: 45px;border-right: 1px solid #D7D7D7;">
		<ul id="pinGroup" class="app-task">

			
			 <draggable v-model="pinItems" group="sideBtn" animation="300" dragClass="dragClass" ghostClass="ghostClass" chosenClass="chosenClass" @start="onStartPin" @end="onEndPin">
			                    <transition-group>
								<li v-for="(item,i) in getPinItems" :key="item.id" @click="openTask(item.id,i)" data-role="task" :class="isActive(item.id)" :item-id="item.id" :title="item.title">
									<img class="icon" :src="item.icon">
								</li>	
			                    </transition-group>
			  </draggable>
		</ul>
		
		<div style="border-top: 1px solid lightgrey;margin: 8px;"></div>
		
		<ul id="appGroup" class="app-task">
		<draggable v-model="items" group="sideBtn" animation="300" dragClass="dragClass" ghostClass="ghostClass" chosenClass="chosenClass" @start="onStart" @end="onEnd">
		                   <transition-group>
			<li @click="openTask(item.id,i)" v-for="(item,i) in getItems"  :key="item.id" data-role="task" :class="isActive(item.id)" :task-id="item.id" :title="item.title">
				<img class="icon" :src="item.icon">
			</li>
			</transition-group>
			</draggable>
		</ul>
	</div>
	`,
	methods: {
		openFav() {
			//todo实现打开书签
		},
		openTask(taskId, index) {
			this.browserUI.switchToTask(taskId)
		},
		getTitle(name, index) {
			//如果标签没名字，就给它取个默认名字
			if (name == null) {
				return l('defaultTaskName').replace('%n', index + 1)
			} else {
				return name
			}

		},
		getIcon(task) {
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
		//开始拖拽事件
		onStart() {
			this.drag = true;
		},
		//拖拽结束事件
		onEnd(end) {
			console.log(end)
			this.drag = false;
			console.log('拖动了普通列表')
			console.log(this.items)
			
		},
		//开始拖拽事件
		onStartPin() {
			this.drag = true;
		},
		//拖拽结束事件
		onEndPin(end) {
			console.log(end)
			this.drag = false;
			console.log('拖动了置顶列表')
			console.log(this.pinItems)
			
		},

	},
})
