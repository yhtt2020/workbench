var windowManager
app.whenReady().then(()=>{
  windowManager=new WindowManager({
  })
  windowManager.init()
  let resizingSplitBar=false
  let timer=null
  ipc.on('startResizeSplitBar',()=>{
    console.log('接收到消息')
    resizingSplitBar=true
    console.log('启动一个计时器')
    timer=setInterval(()=>{
      if(resizingSplitBar){
        console.log('执行一个周期的调整位置')
        windowManager.resetAttachPosition()
      }else{
        clearInterval(timer)
        timer=null
      }
    },10)
  })

  ipc.on('stopResizeSplitBar',()=>{
    console.log('取消调整')
    resizingSplitBar=false
  })

})

