require('../../dist/localization.build.js')
var electron = require('electron')
var ipc = electron.ipcRenderer
window.l=l
const { contextBridge } = require('electron')
//将语言包的接口暴露给里面的页面
contextBridge.exposeInMainWorld('l', l)
window.addEventListener('message', function (e) {
  if (!e.origin.startsWith('file://')) {
    return
  }
  console.log(e.data.message)
  let messageType=getMessageType(e.data)
  switch(messageType){
	  case 'getGlobal':
		  ipc.send('getGlobal')
		  break
	  case 'openBookMarks':
		  ipc.send('showBookmarks')
		  break
	  case 'switchToTask':
		  ipc.send('a')
  }


  
  
  console.log('getMessageFromSidebar',e.data)
  
})
function getMessageType(data){
	if(data && data.message )
		return data.message
	else
		return ''
}

setInterval(function(){
	ipc.send('getGlobal')
},1000)

ipc.on('receiveGlobal',function(e,data){
	window.postMessage({message:'receiveGlobal',data:data})
})
