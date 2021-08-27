var searchbar = require('searchbar/searchbar.js')
let aList = document.getElementsByClassName("openTab")

function initialize() {
	for(let i in aList) {
		aList[i].onclick = function (e) {
			searchbar.openURL('http://www.baidu.com',e )
		}
	}
}


module.exports = {
	initialize
}
