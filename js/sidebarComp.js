//const browserUI= require('./js/browserUI.js')

Vue.component('sidebar', {
	props: {},
	data: function() {
		return {
			
			//用于渲染组件的数组
			items: [], //置顶的数组
			pinItems: [], //下方列表

			drag: false,
			remote:{},
			
			tasks:tasks //绑定tasks，这样tasks变动，属性也会跟着变
		}

	},
	mounted: function() {

		// this.$nextTick(() => {
		// 	aList = this.getList()
		// 		console.log(tasks)
		// 	this.tasks = tasks;

		// 	this.refreshAll()
		// })

		// let item = {
		// 	title: '打开标签', //名称，用于显示提示
		// 	index: 0, //索引
		// 	id: "1", //id
		// 	icon: "/icons/fav.png", //图标
		// 	draggable: true, //是否允许拖拽
		// 	ext: '', //额外的信息
		// 	fixed: false //固定
		// }
		// this.pinItems.push({
		// 	title: '打开标签',
		// 	id: "1",
		// 	icon: "/icons/fav.png"
		// })
		
				
		//在置顶区域插入一个收藏夹的图标按钮
		this.pinItems = this.$sidebarItems.pinItems
		let item = {
			title: '收藏夹', //名称，用于显示提示
			index: 0, //索引
			id: 1, //id
			icon: "icons/fav.png", //图标
			draggable: true, //是否允许拖拽
			ext: '', //额外的信息
			fixed: true,//锁定，不让它移动
			type: 'system-bookmark'
		}
		this.pinItems.push(item)
		
		this.items = this.$sidebarItems.items
		if (tasks != null) {
			//从任务当中取得任务的小组
			let tasksArray = tasks.getAll()
			let that=this
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
					ext: task.id, //额外的信息
					fixed: false,
					type: 'task'
				}
				that.items.push(item)
		
			})
		}
		this.dumpSidebarItems()
	

	},
	computed: {
		getItems: {
			get() {
				console.log('重新拉取item')
				return this.items
			},
			set(newValue) {
				this.items = newValue
				this.dumpSidebarItems()
			}
		},
		getPinItems: {

			get() {
				console.log('重新拉取pinitem')
				return this.pinItems
			},
			// setter
			set(newValue) {
				this.pinItems = newValue
				this.dumpSidebarItems()

			}

		},
		isActive() {
			return (id) => {
				return {
					active: id ==tasks.getSelected().id,
					'app-task': true
				}

			}

		}

	},
	template: `
	<div id="sidebar" style="left:0;height: 100vh;width: 45px;border-right: 1px solid #D7D7D7;">
		<ul id="pinGroup" class="app-task">

			
			 <draggable v-model="getPinItems" group="sideBtn" animation="300" dragClass="dragClass" ghostClass="ghostClass" chosenClass="chosenClass" :move="onMove" @start="onStart" @end="onEnd">
			                    <transition-group>
								<li v-for="(item,i) in getPinItems" :key="item.id" @click="openPinItem(item.id,i)" data-role="task" :class="isActive(item.id)" :item-id="item.id" :title="item.title">
									<img class="icon" :src="item.icon">
								</li>	
			                    </transition-group>
			  </draggable>
		</ul>
		
		<div style="border-top: 1px solid lightgrey;margin: 8px;"></div>
		
		<ul id="appGroup" class="app-task">
		<draggable v-model="getItems" group="sideBtn" animation="300" dragClass="dragClass" ghostClass="ghostClass" chosenClass="chosenClass" :move="onMove" @start="onStart" @end="onEnd">
		                   <transition-group>
			<li @click="openItem(item.id,i)" v-for="(item,i) in getItems"  :key="item.id" data-role="task" :class="isActive(item.id)" :item-id="item.id" :title="item.title">
				<img class="icon" :src="item.icon">
			</li>
			</transition-group>
			</draggable>
		</ul>
	</div>
	`,
	methods: {
		openPinItem(id, index) {
			if (this.pinItems[index].type == 'system-bookmark')
				{
					this.$tabEditor.show(tabs.getSelected(), '!bookmarks ')
				}
				
			this.currentId=id	
			
		},
		openItem(id, index) {
			browserUI.switchToTask(id, index)
			this.currentId=id
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
		onEnd(e) {
			this.drag = false;
			
			//找到拖动的任务的id
			let el = e.item
			var droppedTaskId = el.getAttribute('item-id')
			let newIndex = this.getNewIndex(droppedTaskId)
			let droppedTask = tasks.splice(tasks.getIndex(droppedTaskId), 1)[0]
			//两轮寻找后，一定会找到真正的id
			tasks.splice(newIndex, 0, droppedTask)
		},
		onMove({
			relatedContext,
			draggedContext
		}) {
			const relatedElement = relatedContext.element;
			const draggedElement = draggedContext.element;
			return (
				(!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
			);
		},
		//对任务数组重新进行排序
		getNewIndex(droppedTaskId) {
			let index = 0
			let find = 0
			for (var i = 0; i < this.pinItems.length; i++) {
				if (this.pinItems[i]['type'] == 'task')
					index++
				//如果当前新数组的元素是task类型，且id和拓转的是一样的。则直接返回index即可了
				if (this.pinItems[i]['type'] == 'task' && this.pinItems[i]['ext'] == droppedTaskId) {
					index = index - 1
					find = 1
					break;
				}
			}
			if (find == 0) {
				for (var i = 0; i < this.items.length; i++) {
					//继续找，如果上面没找到index应该还是-1
					if (this.items[i]['type'] == 'task') {
						index++
					}
					if (this.items[i]['type'] == 'task' && this.items[i]['ext'] == droppedTaskId) {
						index = index - 1 //需要加上第一组的id的总数
						break;
					}
				}
			}
			return index

		},
		dumpSidebarItems() {
			window.sidebarItems = {
				'pinItems': this.pinItems,
				'items': this.items
			}
		}
	}

})
