//const browserUI= require('./js/browserUI.js')

Vue.component('sidebar', {
	data: function() {
		return {
			drag: false,
			remote: {},
		}

	},
	mounted: function() {
		// let item = {
		// 	title: '打开标签', //名称，用于显示提示
		// 	index: 0, //索引
		// 	id: "1", //id
		// 	icon: "/icons/fav.png", //图标
		// 	draggable: true, //是否允许拖拽
		// 	ext: '', //额外的信息
		// 	fixed: false //固定
		// }
		this.$store.commit('initItems')
	},
	computed: {
		getItems: {
			get() {
				//将task与items同步一次
				return this.$store.getters.getItems
			},
			set(newValue) {
				this.$store.commit('saveItems', newValue)
			}
		},
		getPinItems: {
			get() {
				//将task与items同步一次
				return this.$store.getters.getPinItems
			},
			// setter
			set(newValue) {
				this.$store.commit('savePinItems', newValue)
			}

		},
		isActive() {
			return (id) => {
				return {
					active: id == this.$store.state.selected,
					'app-task': true
				}
			}

		}

	},
	template: `
	<div id="sidebar" class="side-container">
		<ul id="pinGroup" class="app-task" style="margin-bottom: 0;">

			
			 <draggable v-model="this.$store.getters.getPinItems" group="sideBtn" animation="300" dragClass="dragClass" ghostClass="ghostClass" chosenClass="chosenClass"  @start="onStart" @end="onEnd">
			                    <transition-group>
								<li v-for="(item,i) in this.$store.getters.getPinItems" :key="item.id" @click="openPinItem(item.id,i)" data-role="task" :class="isActive(item.id)" :item-id="item.id" >
									<a-popover :title="item.title+'（右键查看)'" placement="right" :mouseEnterDelay="0.1" :mouseLeaveDelay="0.1" :destroyTooltipOnHide="true" overlayClassName="tips">
									<template slot="content">
									
																<ul class="tabs">
																<li class="tab-title" v-for="(tab,j) in item.tabs" :key="tab.id">
																	<img class="tab-icon" :src="tab.icon"> {{ tab.title }}
																</li>
																</ul>
																</template>
											<div class="wrapper">
											<img class="icon" :src="item.icon" >
											</div>
									 </a-popover>
								</li>	
			                    </transition-group>
			  </draggable>
		</ul>
		
		<div style="border-top: 1px solid lightgrey;margin: 8px;"></div>
		
		<div class="app-box" >
		
		<ul id="appGroup" class="app-task app-items">
		<draggable v-model="this.$store.getters.getItems" group="sideBtn" animation="300" dragClass="dragClass" ghostClass="ghostClass" chosenClass="chosenClass"  @start="onStart" @end="onEnd">
		                   <transition-group>
			<li @click="openItem(item.id,i)" v-for="(item,i) in this.$store.getters.getItems"  :key="item.id" data-role="task" :class="isActive(item.id)" :item-id="item.id"   >
				<a-popover :title="item.title+'（右键查看)'" placement="right" :mouseEnterDelay="0" :mouseLeaveDelay="0.1"  :destroyTooltipOnHide="true" overlayClassName="tips">
				   <template slot="content">
				   
							<ul class="tabs">
							<li class="tab-title" v-for="(tab,j) in item.tabs" :key="tab.id">
								<img class="tab-icon" :src="tab.icon"> {{ tab.title }}
							</li>
							</ul>
							</template>
							<div class="wrapper">
							 <img class="icon" :src="item.icon">
							</div>
				   
				  </a-popover>
			</li>
			</transition-group>
			</draggable>
		</ul>
		</div>
	</div>
	`,
	methods: {
		openPinItem(id, index) {
			if (this.$store.getters.getItems.pinItems[index].type == 'system-bookmark') {
				//this.$tabEditor.show(tasks.getSelected().tabs.getSelected(), '!bookmarks ')
				postMessage({
					message: 'openBookMarks'
				})
			}
		},
		openItem(id, index) {
			postMessage({
				message: 'switchToTask',
				id: id,
				index: index
			})
			this.$store.commit('setSelected',id)
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
				!draggedElement.fixed //&&(!relatedElement || !relatedElement.fixed) 
			);
		},
		//对任务数组重新进行排序
		getNewIndex(droppedTaskId) {
			let index = 0
			let find = 0
			let pinItems = this.$store.getters.getItems.pinItems
			let items = this.$store.getters.getItems.items
			for (var i = 0; i < pinItems.length; i++) {
				if (pinItems[i]['type'] == 'task')
					index++
				//如果当前新数组的元素是task类型，且id和拓转的是一样的。则直接返回index即可了
				if (pinItems[i]['type'] == 'task' && pinItems[i]['ext'] == droppedTaskId) {
					index = index - 1
					find = 1
					break;
				}
			}
			if (find == 0) {
				for (var i = 0; i < items.length; i++) {
					//继续找，如果上面没找到index应该还是-1
					if (items[i]['type'] == 'task') {
						index++
					}
					if (items[i]['type'] == 'task' && items[i]['ext'] == droppedTaskId) {
						index = index - 1 //需要加上第一组的id的总数
						break;
					}
				}
			}
			return index

		}
	}

})
