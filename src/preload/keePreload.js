const KdbxModel=require('../model/kdbxModel.js')
const util=require('../util/util.js')

const tools=util.tools
const ipc=require('electron').ipcRenderer
window=tools.getWindowArgs(window)
window.tabData=window.globalArgs['tab-data']
window.$models={
  appModel:require('../model/appModel'),
  settingModel:require('../model/settingModel.js'),
  util:util,
  passwordModel:require('../model/passwordModel'),
  kdbxModel:new KdbxModel(),
  ipc
}
window.$models.appModel.initDb()
window.tsbApi=require('../browserApi/baseApi')

ipc.invoke('getPwdTab').then(data=>{
  window.tabData=data
})
window.ipc=require('electron').ipcRenderer


