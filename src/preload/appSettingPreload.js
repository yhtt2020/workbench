let devAppModel=require('../model/devAppModel')
devAppModel.initialize()
window.$models={
  appModel:require('../model/appModel'),
  devAppModel:devAppModel,
  settingModel:require('../model/settingModel.js'),
  util:require('../util/util.js')
}
window.$models.appModel.initDb()
window.tsbApi=require('../browserApi/baseApi')


window.ipc=require('electron').ipcRenderer


