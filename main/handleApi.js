var windowManager
app.whenReady().then(()=>{
  windowManager=new WindowManager({
  })
  windowManager.init()
  let resizingSplitBar=false
  let timer=null
  ipc.on('startResizeSplitBar',()=>{
    resizingSplitBar=true
    timer=setInterval(()=>{
      if(resizingSplitBar){
        windowManager.resetAttachPosition()
      }else{
        clearInterval(timer)
        timer=null
      }
    },10)
  })

  ipc.on('stopResizeSplitBar',()=>{
    resizingSplitBar=false
  })

  /**
   * tab吸附到右侧
   */
  ipc.on('setTabAttach',(event,args)=>{
    if(Object.keys(viewMap).length<=1){
      sendMessage({type:'error',config:{content:'至少激活2个标签才可使用侧边分屏功能。'}})
      return
    }
    sendIPCToMainWindow('changeTabAttach',{tab:args.tab})
    windowManager.setTabAttach({tab:args.tab})
  })
})

