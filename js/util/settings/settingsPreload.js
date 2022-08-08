let systemInfo={}
let notInner=null
let settingsOrigin='http://localhost:1600'
function notInnerPage(e){
  if(notInner===null)
    notInner=!e.origin.startsWith('file://') && e.origin!==settingsOrigin
  return notInner
}
window.addEventListener('message', function (e) {
  if (notInnerPage(e)) {
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
		ipc.send('getIsDefaulBrowser')
	}

  if(e.data.message=='valueCount'){
    ipc.send('valueCount',e.data.count)
  }

  if(e.data.message==='themeChange'){
    ipc.send('themeChange',{status:e.data.status})
  }

})

ipc.on('returnIsDefaultBrowser',function(e,data){
	window.postMessage({message:'returnIsDefaultBrowser',result:data})
})

ipc.on('receiveSettingsData', function (e, data) {
  if (!notInnerPage(e)) { // probably redundant, but might as well check
    systemInfo=data.systemInfo
    console.log('回传',data)
    window.postMessage({ message: 'receiveSettingsData', settings: data })
  }
})
ipc.on('setBrowserReturn',(e,args)=>{
  console.log(args)
})
