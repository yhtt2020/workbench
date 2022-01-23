let systemInfo={}
window.addEventListener('message', function (e) {
  if (!e.origin.startsWith('file://')) {
    return
  }

  if (e.data && e.data.message && e.data.message === 'getSettingsData') {
    ipc.send('getSettingsData')


  }

  if (e.data && e.data.message && e.data.message === 'setSetting') {
    ipc.send('setSetting', { key: e.data.key, value: e.data.value })
  }


	//唤起主进程设置默认浏览器的请求，由于设置是异步的，这里只发起请求即可
	if(e.data.message=='callSetOrRemoveDefaultBrowser'){
		ipc.send('callSetOrRemoveDefaultBrowser',{systemInfo:systemInfo})
	}

	//询问主进程，是否是默认浏览器
	if(e.data.message=='getIsDefaulBrowser'){
		ipc.send('getIsDefaulBrowser' )
	}

})

ipc.on('returnIsDefaultBrowser',function(e,data){
	window.postMessage({message:'returnIsDefaultBrowser',result:data})
})

ipc.on('receiveSettingsData', function (e, data) {
  console.log(data)
  if (window.location.toString().startsWith('file://')) { // probably redundant, but might as well check
    systemInfo=data.systemInfo
    window.postMessage({ message: 'receiveSettingsData', settings: data }, 'file://')
  }
})
ipc.on('setBrowserReturn',(e,args)=>{
  console.log(args)
})
