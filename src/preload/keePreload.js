const KdbxModel=require('../model/kdbxModel.js')
const util=require('../util/util.js')

const tools=util.tools
window=tools.getWindowArgs(window)
window.$models={
  appModel:require('../model/appModel'),
  settingModel:require('../model/settingModel.js'),
  util:util,
  passwordModel:require('../model/passwordModel'),
  kdbxModel:new KdbxModel(),
  ipc:require('electron').ipcRenderer
}
window.$models.appModel.initDb()
window.tsbApi=require('../browserApi/baseApi')


window.ipc=require('electron').ipcRenderer


