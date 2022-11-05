let devAppModel=require('../model/devAppModel')
devAppModel.initialize()
window.$models={
  appModel:require('../model/appModel'),
  devAppModel:devAppModel
}
window.$models.appModel.initDb()
window.tsbApi=require('../browserApi/baseApi')


window.ipc=require('electron').ipcRenderer


