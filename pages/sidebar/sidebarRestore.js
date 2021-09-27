const path = require('path')
const fs = require('fs')
const {
	contextBridge
} = require('electron')


window.globalArgs = {}
let loaded = false
process.argv.forEach(function(arg) {
	if (arg.startsWith('--')) {
		var key = arg.split('=')[0].replace('--', '')
		var value = arg.split('=')[1]
		globalArgs[key] = value
	}
})
if (navigator.platform === 'MacIntel') {
	window.platformType = 'mac'
} else if (navigator.platform === 'Win32') {
	window.platformType = 'windows'
} else {
	window.platformType = 'linux'
}

const sidebarRestore = {
	//存储在sidebarRestore.json中，与其他的分开存储有一个好处是隔离性，不容易因为其他数据出错而丢失
	savePath: window.globalArgs['user-data-path'] + (platformType === 'windows' ? '\\sidebarRestore.json' :
		'/sidebarRestore.json'),
	previousState: null,
	save: function(forceSave, sync) {
		//序列化sidebar成json
		var sidebarData = window.$store.getters.getStringifyableState
		//console.log(sidebarData) //输出一下看看数据

		var stateString = JSON.stringify(sidebarData)
		var data = {
			version: 2,
			state: JSON.parse(stateString),
			saveTime: Date.now()
		}

		//去重，如果没有变更则不再写入，减少磁盘io
		if (forceSave === true || stateString !== sidebarRestore.previousState) {
			if (sync === true) {
				fs.writeFileSync(sidebarRestore.savePath, JSON.stringify(data))
			} else {
				fs.writeFile(sidebarRestore.savePath, JSON.stringify(data), function(err) {
					if (err) {
						console.warn(err)
					}
				})
			}
			sidebar.previousState = stateString
		}
	},
	restore: function() {
		console.log(sidebarRestore.savePath)
		var savedStringData
		try {
			savedStringData = fs.readFileSync(sidebarRestore.savePath, 'utf-8')
		} catch (e) {
			console.warn('failed to read sidebar restore data', e)
		}

		/*
		Disabled - show a user survey on startup
		// the survey should only be shown after an upgrade from an earlier version
		var shouldShowSurvey = false
		if (savedStringData && !localStorage.getItem('1.15survey')) {
		  shouldShowSurvey = true
		}
		localStorage.setItem('1.15survey', 'true')
		*/

		try {
			// first run, show the tour

			if (!savedStringData) {
				//首次运行
				//不需要创建任务，本身系统就会创建任务，这里只需要留空就可以了
				window.loaded = true
				window.sidebarData=false
				//console.log('loaded failed first run')
				return
			}

			var data = JSON.parse(savedStringData) //转化为存储数据

			// 数据无法恢复
			if ((data.version && data.version !== 2) || (data.state && data.state.sidebar && data.state.sidebar.length === 0)) {
				//window.$store.commit('initItems') //就初始化一个带fav按钮的侧边栏
				window.loaded = true //设置为已经读入了左侧栏
				window.sidebarData=false
				//console.log('loaded failed cant restore')
				//console.log(data)
				return
			}
			//尝试读取一次getAll，这个会创建一个默认的数组
			window.sidebarData=data
			//console.log('loaded success')
			//console.log(window.sidebarData)
			window.loaded = true //设置为已经读入了左侧栏
		} catch (e) {
			// an error occured while restoring the session data

			console.error('restoring sidebar failed: ', e)

			var backupSavePath = require('path').join(window.globalArgs['user-data-path'],
				'sidebarRestoreBackup-' + Date.now() + '.json')

			fs.writeFileSync(backupSavePath, savedStringData)

			//重新初始化侧边栏
			//window.$store.commit('initItems')
			//console.log('loaded failed cant format wrong')
			window.sidebarData=false
			window.loaded = true //设置为已经读入了左侧栏
		}

	},
	initialize: function() {
		//每隔30s存储一次

		setInterval(sidebarRestore.save, 5000)

		window.onbeforeunload = function(e) {
			sidebarRestore.save(true, true)
			console.log(sidebarRestore.savePath)
		}
		sidebarRestore.restore()
	}
}
module.exports = sidebarRestore

