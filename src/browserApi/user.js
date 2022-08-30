const {
  ipcRenderer
} = require('electron')
const ipc = ipcRenderer
let apiUserInfo={}

const user={
  get:async () => {
    let userInfo = await ipc.invoke('user.get')
    return userInfo
  },
  login:(callback)=>{
    ipc.once('loginCallback',(event,args)=>{
      apiUserInfo=args.data
      callback(args.data.userInfo)

    })
    ipc.send('login')
  },

}
module.exports=user
