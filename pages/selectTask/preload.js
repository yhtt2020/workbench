const path = require('path')
const fs = require('fs')
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
var savePath = window.globalArgs['user-data-path'] + (platformType === 'windows' ? '\\sessionRestore.json' :
	'/sessionRestore.json')
var savedStringData = null
var tasks = []
try {
	savedStringData = fs.readFileSync(savePath, 'utf-8')
} catch (e) {
	console.warn('failed to read session restore data', e)
}
try {
	var data = JSON.parse(savedStringData)
	data.state.tasks.forEach(function(task) {
		tasks.push(task)
	})
} catch (e) {
	console.error('restoring session failed: ', e, savedStringData)
}
console.log(tasks)
window.tasks = tasks

