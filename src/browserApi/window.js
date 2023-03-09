
const ipcHelper=require('./ipcHelper')
function send(channel,args={}){
  ipcHelper.send('window',channel,args)
}
async function sendSync(channel,args={}){
  return await ipcHelper.sendSync('window',channel,args)
}

const windowApi = {
  close: () => {
    send('close')
  },
  hide:()=>{
    send('hide')
  },
  show:()=>{
    send('show')
  },
  minimize(){
    send('minimize')
  },
  restore(){
    send('restore')
  },
  maximize(){
    send('maximize')
  },
  unmaximize:()=>{
    send('unmaximize')
  },
  async getBounds(){
    return await sendSync('getBounds')
  },
  setBounds(bounds){
    send('setBounds',bounds)
  },
  setFullScreen(flag){
    send('setFullScreen',flag)
  },
  async getSize(){
    return await sendSync('getSize')
  },
  setSize(width,height){
    send('setSize', { width,height })
  },
  setAlwaysOnTop(flag,level){
    send('setAlwaysOnTop',{flag,level})
  },
  async isAlwaysOnTop(){
   return await sendSync('isAlwaysOnTop')
  },

  /**
   * 获取当前窗体的附加信息
   * @returns {Promise<*>}
   */
  async getAttachStatus(){
    return await sendSync('getAttachStatus')
  },

  /**
   * 附加到主窗体的某个位置，默认为右侧，暂时仅支持右侧
   * @param pos 'right'
   */
  attach(pos){
    send('attach',{pos:pos})
  },
  /**
   * 分离
   */
  detach(){
    send('detach')
  }
}



module.exports=windowApi
