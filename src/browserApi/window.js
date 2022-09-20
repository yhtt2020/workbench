const {
  ipcRenderer
} = require('electron')
const ipc = ipcRenderer
function send(channel,args={}){
  args['_name']=window.baseApi.runtime.name
  ipc.send('api.window.'+channel,args)
}
async function sendSync(channel,args={}){
  args['_name']=window.baseApi.runtime.name
  return await ipc.sendSync('api.window.'+channel,args)
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
  async getSize(){
    return await sendSync('getSize')
  },
  setSize(){
    send('setSize',size)
  },
  setAlwaysOnTop(flag){
    send('setAlwaysOnTop',{flag})
  },
  async isAlwaysOnTop(){
   return await sendSync('isAlwaysOnTop')
  }
}



module.exports=windowApi
