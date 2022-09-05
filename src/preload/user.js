const tools=require('../util/util').tools
window=tools.getWindowArgs(window)
console.log(window.globalArgs)

const userModel = eval('require')('../model/userModel')
const configModel = eval('require')('../model/configModel')
const spaceModel = eval('require')('../model/spaceModel')
const spaceVersionModel=require('../model/spaceVersionModel')
window.ipc=require('electron').ipcRenderer
window.$models={
  userModel,
  configModel,
  spaceModel,
  spaceVersionModel
}
window.tsbApi=require('../browserApi/baseApi.js')
