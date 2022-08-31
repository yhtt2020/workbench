const {
  ipcRenderer
} = require('electron')
const ipc = ipcRenderer
let apiUserInfo={}
const {api} =require('../../server-config')

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
  /**
   *
   * @param uid 0则为自己
   * @param type 类型app为应用内打开，web为网页打开
   */
  openSpace(uid=0,type='app'){
    //todo 自己的逻辑
    let uidStr=uid===0?'':'?uid='+uid
    let url=api.getUrl(api.API_URL.user.space)+uidStr
    console.log(url)
    if(type==='app'){
      ipc.send('handleTsbProtocol',{url:'tsb://app/redirect/?package=com.thisky.com&url='+url})
    }else{
      ipc.send('addTab',{url:url})
    }
  }

}
module.exports=user
