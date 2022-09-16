class SpiltBar {
  bar
  watch(){
    ipc.on('showSplitBar',(event,args)=>{
      this.show(args.bounds)
    })
  }
  constructor (props) {

  }

  bindInnerBarEvent(innerBar){
    innerBar.addEventListener('mousedown',(e)=>{
      console.log('发送指令开始调节')
      innerBar.setPointerCapture(1)
      ipc.send('startResizeSplitBar')
    })
    innerBar.addEventListener('mouseup',(e)=>{
      console.log('发送指令停止调节')
      innerBar.releasePointerCapture(1)
      ipc.send('stopResizeSplitBar')
    })
  }
  show(bounds){
    if(document.querySelectorAll('.split-bar').length>0){
      this.bar.style.left=bounds.x+bounds.width +'px'
      return
    }
    let bar=document.createElement('div')
    bar.classList.add('split-bar')
    bar.style.left=bounds.x+bounds.width +'px'
    bar.style.top=bounds.y+'px'
    bar.style.height=bounds.height+'px'
    let innerBar=document.createElement('div')
    innerBar.classList.add('inner-bar')
    this.bindInnerBarEvent(innerBar)
    bar.appendChild(innerBar)
    document.body.appendChild(bar)
    this.bar=bar
  }

}

module.exports=SpiltBar
