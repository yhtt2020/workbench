const tools=require('../util/util').tools
window=tools.getWindowArgs(window)
const userModel = eval('require')('../model/userModel')
const configModel = eval('require')('../model/configModel')
const spaceModel = eval('require')('../model/spaceModel')
window.ipc=require('electron').ipcRenderer
window.$models={
  userModel,
  configModel,
  spaceModel
}
