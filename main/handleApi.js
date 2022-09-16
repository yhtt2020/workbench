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

})

