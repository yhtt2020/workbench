const {
  ipcRenderer
} = require('electron')
const ipc = ipcRenderer
function send(channel,args={}){
  ipc.send('api.window.'+channel,args)
}
async function sendSync(channel){
  ipc.sendSync(channel)
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
  }
}



module.exports=windowApi
