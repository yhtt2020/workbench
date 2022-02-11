var statistics = require('js/statistics.js')
var searchEngine = require('js/util/searchEngine.js')
var urlParser = require('js/util/urlParser.js')

/* common actions that affect different parts of the UI (webviews, tabstrip, etc) */

var settings = require('util/settings/settings.js')
var webviews = require('webviews.js')
var focusMode = require('focusMode.js')
var tabBar = require('navbar/tabBar.js')
var tabEditor = require('navbar/tabEditor.js')
var searchbar = require('searchbar/searchbar.js')

const userStatsModel = require('../pages/util/model/userStatsModel')

/* creates a new task */

function addTask () {
  tasks.setSelected(tasks.add())

  tabBar.updateAll()
  addTab()
}

/* creates a new tab */

/*
options
  options.enterEditMode - whether to enter editing mode when the tab is created. Defaults to true.
  options.openInBackground - whether to open the tab without switching to it. Defaults to false.
*/
function addTab (tabId = tabs.add(), options = {}) {
  /*
  adding a new tab should destroy the current one if either:
  * The current tab is an empty, non-private tab, and the new tab is private
  * The current tab is empty, and the new tab has a URL
  */

  if (!options.openInBackground && !tabs.get(tabs.getSelected()).url && ((!tabs.get(tabs.getSelected()).private && tabs.get(tabId).private) || tabs.get(tabId).url)) {
    destroyTab(tabs.getSelected())
  }

  tabBar.addTab(tabId)
  webviews.add(tabId)

  if (!options.openInBackground) {
    switchToTab(tabId, {
      focusWebview: options.enterEditMode === false
    })
    if (options.enterEditMode !== false) {
      if(tabs.get(tabId).url!=="ts://newtab"){
        //添加新tab不弹窗
        //todo 后续增加配置项，可以选择新标签的功能
        tabEditor.show(tabId)
      }
    }
  } else {
    tabBar.getTab(tabId).scrollIntoView()
  }
}

function moveTabLeft (tabId = tabs.getSelected()) {
  tabs.moveBy(tabId, -1)
  tabBar.updateAll()
}

function moveTabRight (tabId = tabs.getSelected()) {
  tabs.moveBy(tabId, 1)
  tabBar.updateAll()
}

/* destroys a task object and the associated webviews */

function destroyTask (id) {
  var task = tasks.get(id)

  task.tabs.forEach(function (tab) {
    webviews.destroy(tab.id)
  })

  tasks.destroy(id)
}

/* destroys the webview and tab element for a tab */
function destroyTab (id) {
  tabBar.removeTab(id)
  tabs.destroy(id) // remove from state - returns the index of the destroyed tab
  webviews.destroy(id) // remove the webview
}

/* destroys a task, and either switches to the next most-recent task or creates a new one */

function closeTask (taskId) {
  var previousCurrentTask = tasks.getSelected().id

  destroyTask(taskId)
	//window.$store.getters.fillTasksToItems
  if (taskId === previousCurrentTask) {
    // the current task was destroyed, find another task to switch to

    if (tasks.getLength() === 0) {
      // there are no tasks left, create a new one
      return addTask()
    } else {
      // switch to the most-recent task

      var recentTaskList = tasks.map(function (task) {
        return { id: task.id, lastActivity: tasks.getLastActivity(task.id) }
      })

      const mostRecent = recentTaskList.reduce(
        (latest, current) => current.lastActivity > latest.lastActivity ? current : latest
      )

      return switchToTask(mostRecent.id)
    }
  }
}

/* destroys a tab, and either switches to the next tab or creates a new one */

function closeTab (tabId) {
  /* disabled in focus mode */
  if (focusMode.enabled()) {
    focusMode.warn()
    return
  }

  if(!!tabs.get(tabId).lock){
    ipc.send('message',{type:'info',config:{content:'该标签为锁定标签，无法直接关闭，请解锁后再关闭。',key:'lockTip'}})
    return
  }

  if (tabId === tabs.getSelected()) {
    var currentIndex = tabs.getIndex(tabs.getSelected())
    var nextTab =
    tabs.getAtIndex(currentIndex - 1) || tabs.getAtIndex(currentIndex + 1)

    destroyTab(tabId)

    if (nextTab) {
      switchToTab(nextTab.id)
    } else {
      addTab()
    }
  } else {
    destroyTab(tabId)
  }
}

/* changes the currently-selected task and updates the UI */

function switchToTask (id) {
  tasks.setSelected(id)

  tabBar.updateAll()

  var taskData = tasks.get(id)

  if (taskData.tabs.count() > 0) {
    var selectedTab = taskData.tabs.getSelected()

    // if the task has no tab that is selected, switch to the most recent one

    if (!selectedTab) {
      selectedTab = taskData.tabs.get().sort(function (a, b) {
        return b.lastActivity - a.lastActivity
      })[0].id
    }

    switchToTab(selectedTab)
  } else {
    addTab()
  }
}

/* switches to a tab - update the webview, state, tabstrip, etc. */

function switchToTab (id, options) {
  options = options || {}

  tabEditor.hide()

  tabs.setSelected(id)
  tabBar.setActiveTab(id)
  webviews.setSelected(id, {
    //focus: options.focusWebview !== false
  })
  if (!tabs.get(id).url) {
    document.body.classList.add('is-ntp')
  } else {
    document.body.classList.remove('is-ntp')
  }
}

tasks.on('tab-updated', function (id, key) {
  if (key === 'url' && id === tabs.getSelected()) {
    document.body.classList.remove('is-ntp')
  }
})

webviews.bindEvent('did-create-popup', function (tabId, popupId, initialURL) {
  var popupTab = tabs.add({
    // in most cases, initialURL will be overwritten once the popup loads, but if the URL is a downloaded file, it will remain the same
    url: initialURL,
    private: tabs.get(tabId).private
  })
  tabBar.addTab(popupTab)
  webviews.add(popupTab, popupId)
  switchToTab(popupTab)
})

webviews.bindEvent('new-tab', function (tabId, url, openInForeground) {
  var newTab = tabs.add({
    url: url,
    private: tabs.get(tabId).private // inherit private status from the current tab
  })

  addTab(newTab, {
    enterEditMode: false,
    openInBackground: !settings.get('openTabsInForeground') && !openInForeground
  })
})

webviews.bindIPC('close-window', function (tabId, args) {
  closeTab(tabId)
})

ipc.on('set-file-view', function (e, data) {
  tabs.get().forEach(function (tab) {
    if (tab.url === data.url) {
      tabs.update(tab.id, { isFileView: data.isFileView })
    }
  })
})


//增加一些与其他窗体的互动ipc
ipc.on('switchToTask',function(e,data){
	switchToTask(data.id)
})
ipc.on('switchToTab',function(e,data){
  if(!!!data.taskId){
    switchToTab(data.tabId)
  } else {
    switchToTask(data.taskId)
    switchToTab(data.tabId)
  }
})
ipc.on('renameTask',function(e,data){
  if(data.newName.trim()==='')
  {
    return
  }
  tasks.get(data.id).name=data.newName
})

ipc.on('reloadTask', () => {
  switchToTask(tasks.getSelected().id)
})

//定位到task组的某tabid，往后插入创建tab
//browserUI中有tab和task的环境，而且能直接捕获从preload传出来的ipc，也能拿到tabBar的环境
// ipc.on('toTask-addTab', (event, arg) => {
//   console.log(arg, '---------------@@@@@')
// })

ipc.on('addTaskFromApps',function(e,data){
	let newTask = {
	  name: data.name || null,
	  collapsed:false
	}
	let tid=tasks.add(newTask)
	let newTab= {
      url: data.url || '',
	  title:data.name
    }
	tasks.get(tid).tabs.add(newTab)


})
ipc.on('openApps',function(){
	// let url= 'ts://apps'//左斜杠三条是为了统一判断里tab的三条左斜杠，不知道为什么会这样
	// let findout=false
	// let tid=0
	// let tabId=0
	// tasks.forEach(function(task,index){
	// 	let tTask=task
	// 	tTask.tabs.forEach(function(tab,index){
	// 		//替换左斜杠为右斜杠，保证平台差异一致。
	// 		if(require('util/urlParser.js').getSourceURL(tab.url)==url)
	// 			{
	// 				tid=tTask.id
	// 				tabId=tab.id
	// 				findout=true
	// 			}
	// 	})
	// })
	// if(findout==false){
		// let newTask = {
		//   name: '应用中心',
		//   collapsed:false
		// }
		// tid=tasks.add(newTask)
    //todo 暂时先去除一下防止打开多个的功能，等后面观察一下是否有必要加回来。加回来会导致一些不可预期的切换任务，导致用户懵逼
		let newTab= {
		  url: require('util/urlParser.js').getFileURL( __dirname + '/pages/apps/index.html') ,
		  title:'应用中心'
		}

    tabId=tasks.getSelected().tabs.add(newTab)
    addTab(tabId, { enterEditMode: false })

    switchToTab(tabId)



})
/* 增加一些与其他窗口的互动ipcend*/


/**插入一个简易排序方法*/
	function resortTask(droppedTaskId,adjacentTaskId){
		let droppedTask = tasks.splice(tasks.getIndex(droppedTaskId), 1)[0]
		tasks.splice(adjacentTaskId, 0, droppedTask)

	}

	ipc.on('resortTasks',function(e,data){

		resortTask(data.droppedTaskId,data.adjacentTaskId)

	})
	/**简易排序插入结束*/


searchbar.events.on('url-selected', async function (data) {
  var searchbarQuery = searchEngine.getSearch(urlParser.parse(data.url))
  if (searchbarQuery) {
    statistics.incrementValue('searchCounts.' + searchbarQuery.engine)
    await userStatsModel.incrementValue('searchCounts')  //mark插入对searchCounts的数据统计
  }

  if (data.background) {
    var newTab = tabs.add({
      url: data.url,
      private: tabs.get(tabs.getSelected()).private
    })
    addTab(newTab, {
      enterEditMode: false,
      openInBackground: true
    })
  } else {
    webviews.update(tabs.getSelected(), data.url)
    tabEditor.hide()
  }
})

tabBar.events.on('tab-selected', function (id) {
  switchToTab(id)
})

tabBar.events.on('tab-closed', function (id) {
  closeTab(id)
})

module.exports = {
  addTask,
  addTab,
  destroyTask,
  destroyTab,
  closeTask,
  closeTab,
  switchToTask,
  switchToTab,
  moveTabLeft,
  moveTabRight
}
