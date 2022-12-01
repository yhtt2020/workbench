const KdbxModel=require('../model/kdbxModel.js')
window.$models={
  appModel:require('../model/appModel'),
  settingModel:require('../model/settingModel.js'),
  util:require('../util/util.js'),
  passwordModel:require('../model/passwordModel'),
  kdbxModel:new KdbxModel(),
  ipc:require('electron').ipcRenderer
}
window.$models.appModel.initDb()
window.tsbApi=require('../browserApi/baseApi')


window.ipc=require('electron').ipcRenderer


