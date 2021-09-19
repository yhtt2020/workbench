
var electron = require('electron')
var ipc = electron.ipcRenderer
window.addEventListener('message', function (e) {
  if (!e.origin.startsWith('file://')) {
    return
  }

  if (e.data && e.data.message && e.data.message === 'getGlobal') {
    ipc.send('getGlobal')
	
  }
  
})
setInterval(function(){
	ipc.send('getGlobal')
},1000)
ipc.on('receiveGlobal',function(e,data){
	window.postMessage({message:'receiveGlobal',data:data})
})