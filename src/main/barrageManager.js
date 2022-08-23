const { BrowserWindow ,app,ipcMain} = require('electron')
let win=null
const ipc=ipcMain
app.whenReady().then(()=>{
  ipc.on('closeBarrageWindow',()=>{
    console.log('收到消息closeBarrageWindow')
    if(win && !win.isDestroyed()){
      win.close()
    }
  })

})
class BarrageManager{
  container
  constructor (optionArgs) {
    console.log('开始初始化')
    const DEFAULT_OPTION={
      type:'window', //window,或者view，只有window有窗体交互逻辑，view的话，就不存在这些逻辑了
      parent:undefined  //默认没有父窗体
    }
    let option=Object.assign(DEFAULT_OPTION,optionArgs)
    let bounds={
      width:800,
      height:600,
      x:undefined,
      y:undefined
    }
    if(option.parent){
      if(option.parent.isDestroyed()){
        option.parent=undefined
      }
      bounds =this.getInitBounds(option.parent)
    }

    let window
    if(option.type==='window'){
      window = new BrowserWindow({
        width:bounds.width,
        height:bounds.height,
        transparent:true,
        backgroundColor:'#00000000',
        x:bounds.x,
        y:bounds.y,
        alwaysOnTop:true,
        hasShadow:false,
        frame:false,
        webPreferences:{
          show:false,
          preload:(__dirname+'/barragePreload.js')
        }
      })
    }
    window.loadURL(this.getUrl('barrage.html#/pop'))
    console.log('加载的url',this.getUrl('barrage.html#/pop'))
    window.on('ready-to-show',()=>{
      window.show()
    })
    this.container=window
    win=this.container
  }

  static isAlive(){
    return win && !win.isDestroyed()
  }
  getInitBounds(parent){
    const width=800
    const height=600
    let parentBounds=parent.getBounds()
    let x = parseInt(parentBounds.x + (parentBounds.width- width) / 2)
    let y = parseInt(parentBounds.y +200)
    return { x, y, width:width, height:height }

  }
  getUrl (url) {
    let protocolUrl
    protocolUrl = `tsbapp://./${url}` //todo 需要验证正式环境的协议情况
    if (true) {
      protocolUrl = `http://localhost:1600/${url}`
    }
    return protocolUrl
  }

  destroy(){
    this.container.close()
  }
}

module.exports={BarrageManager}
