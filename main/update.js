const Updater=require('./src/main/update')
let updater=new Updater()
let settingUpdate= settings.get('autoCheckUpdate')
let needCheck=settingUpdate===undefined?true:settingUpdate
if(needCheck){
  console.log('检测升级进入')
  updater.checkUpdate()
}


