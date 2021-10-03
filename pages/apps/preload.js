var electron = require('electron')
var ipc = electron.ipcRenderer
var fs = require('fs')
var http = require('http')
window.addEventListener('message', function(e) {
	if (!e.origin.startsWith('file://')) {
		return
	}
	let messageType = getMessageType(e.data)
	switch (messageType) {
		case 'addTask':
			ipc.send('addTask', {
				name: e.data.name,
				url: e.data.url,
				icon: e.data.icon
			})
			break
	}
})

function getMessageType(data) {
	if (data && data.message)
		return data.message
	else
		return ''
}



let appsRestore = require('./appsRestore.js')
appsRestore.initialize()
window.$appsRestore = appsRestore


function initAppsData() {
	const DevUrl = 'http://127.0.0.1:7002/apps/allApps' //使用egg接口返回数据
	const PrdUrl = 'http://d.xiangtian.ren/api/apps.json' //正式站点的apps数据
	const isDevelopmentMode = true//todo 需要加入开发环境的判断 process.argv.some(arg => arg === '--development-mode')
	const url = isDevelopmentMode ? DevUrl : PrdUrl
	const apiUrl = url
	const apiNative = '/../../api/apps.json'
	var resultsPromise
	window.$appsApiData = null
	const requestOptions = {
		method: 'get',
		headers: {
			'Content-Type': 'application/json'
		}
	}
	fetch(apiUrl, requestOptions)
		.then(res => res.json())
		.then(function(result) {
			window.$appsApiData = result
		})
		.catch(function(e) {
			// retry once
			setTimeout(function() {
				console.warn('无法获取到api')
				fetch(apiUrl, requestOptions)
					.then(res => res.json())
					.then(function(result) {
						window.$appsApiData = result
					})
			}, 5000)
		})


	window.nativeData = JSON.parse(fs.readFileSync(__dirname + apiNative, 'utf-8'))

}
initAppsData()
