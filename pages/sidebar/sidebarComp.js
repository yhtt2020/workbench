const { api } = require('../../server-config')
Vue.component('sidebar', {
	data: function() {
		return {
      lastOpenId:0,
			drag: false,
			remote: {},
			loginPanelTitle:"登陆账号免费体验完整功能",
			loginPanelContent:``,
			userPanelVisible:false,
			devices: [{
					'name': 'IphoneX',
					'width': 375,
					'height': 812,
					'icon': 'mobile'
				}, {
					'name': 'Ipad',
					'width': 768,
					'height': 1024,
					'icon': 'tablet'
				}, {
					'name': 'IpadPro',
					'width': 1024,
					'height': 1366,
					'icon': 'tablet'
				},
				{
					'name': '1080P pc',
					'width': 1920,
					'height': 1080,
					'icon': 'desktop'
				},
				{
					'name': '2K pc',
					'width': 2560,
					'height': 1440,
					'icon': 'desktop'
				},
				{
					'name': '4K pc',
					'width': 4096,
					'height': 2160,
					'icon': 'desktop'
				},


			],
			accounts:[
				{
					'uid':1,
					'nickname':'张三',
					'avatar':'../../icons/apps.svg'
				},
				{
					'uid':2,
					'nickname':'李四',
					'avatar':'../../icons/browser.ico'
				}
			],
      sidebarBottom:0
		}

	},
	beforeCreate() {
		this.form = this.$form.createForm(this, {
			name: 'validate_other'
		});

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
		if (window.sidebarData === false) {
			console.log('comp loaded fail')
			console.log(window.sidebarData)
			this.$store.commit('initItems')
		} else {
			this.$store.state.pinItems = window.sidebarData.state.sidebar.pinItems
			this.$store.state.items = window.sidebarData.state.sidebar.items
		}
    let that=this
    db.system.where({name:'sidebarBottom'}).first((data)=>{
      that.sidebarBottom= data.value
      setTimeout(that.fixElementPosition,250)
    })
	},
	computed: {
		user(){
			return this.$store.state.user
		},
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
	template: '#sidebarTpl',
	methods: {
		toggleUserPanel(){
			console.log('toggele')
			this.userPanelVisible=!this.userPanelVisible
			console.log(this.userPanelVisible)
		},
		switchTask(id, index) {
			postMessage({
				message: 'switchToTask',
				id: id,
				index: index
			})
			this.$store.commit('setSelected', id)
		},
		openPinItem(id, index) {
			if (this.$store.getters.getPinItems[index].type == 'system-bookmark') {
				//this.$tabEditor.show(tasks.getSelected().tabs.getSelected(), '!bookmarks ')
				postMessage({
					message: 'openBookMarks'
				})
			} else if (this.$store.getters.getPinItems[index].type == 'task') {
        this.openItem(id, index)
			}
		},
		openItem(id, index) {
      if(id!==this.lastOpenId){
        this.switchTask(id, index)
        this.lastOpenId=id
      }

		},
		openBottom(action) {
			postMessage({
				message: action
			})

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
			let adjacentTaskId = this.getNewIndex(droppedTaskId)
			let oldTasks = this.$store.state.tasks

			//let droppedTask = oldTasks.splice(oldTasks.getIndex(droppedTaskId), 1)[0]
			//两轮寻找后，一定会找到真正的id
			//oldTasks.splice(adjacentTaskId, 0, droppedTask)
			postMessage({
				'message': 'resortTasks',
				'droppedTaskId': droppedTaskId,
				'adjacentTaskId': adjacentTaskId
			})

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
			let pinItems = this.$store.getters.getPinItems
			let items = this.$store.getters.getItems
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

		},
		changeBottomSize(key) {
			let that = this
			setTimeout(function() {
				that.fixElementPosition()
			}, 200)
      let state= key.length===1?1:0
      db.system.where({name:'sidebarBottom'}).delete()
      db.system.put({name:'sidebarBottom',value:state})

		},
		fixElementPosition() {
			const itemsEl = document.getElementById('itemsEl')
			const bottomsEl = document.getElementById('bottomsEl')
			itemsEl.style.bottom = bottomsEl.offsetHeight + 'px'
      console.log(itemsEl.style.bottom)
		},
		//点击用户登录按钮
		userClick(){
			if(this.user.uid===0){
				this.addTab(api.getUrl(api.API_URL.user.login))
			}else{
				this.addTab(api.getUrl(api.API_URL.user.home))
			}
			this.userPanelVisible=false
		},
		addTab(url){
			postMessage({
				message: "addTab",
				'url':url
			})
		},
		logout(){
			window.insertDefaultUser()
			db.system.where({name:'currentUser'}).delete()
			this.$message.info('注销成功！');
		},
    switchAccount(){
      this.userPanelVisible=false
      this.addTab(api.getUrl(api.API_URL.user.login))
    },
    goProfile(){
      this.userPanelVisible=false
      this.addTab(api.getUrl(api.API_URL.user.profile))
    },
    goGroup(){
      this.userPanelVisible=false
      this.addTab(api.getUrl(api.API_URL.group.index))
    },
    goAccount(){
      this.userPanelVisible=false
      this.addTab(api.getUrl(api.API_URL.user.account))
    },
    addNewTask(e){
      ipc.send('addNewTask')
      this.$message.success({content:'成功添加一个新任务到左侧栏。'})
    },
    closeItem(item){
      if(item.type==='task'){
        ipc.send('closeTask',{tabId:item.id})
        this.$message.success({content:'删除任务成功。'})
      }
    },
    createGroup(){
      ipc.send('createGroup')
    }

	}

})

ipc.on('message',function(event,args){
  if(!!!args.type){
    args.type='open'
  }
  appVue.$message[args.type](args.config)
})
