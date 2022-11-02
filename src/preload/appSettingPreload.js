let devAppModel=require('../model/devAppModel')
devAppModel.initialize()
window.$models={
  appModel:require('../model/appModel'),
  devAppModel:devAppModel
}

window.ipc=require('electron').ipcRenderer


