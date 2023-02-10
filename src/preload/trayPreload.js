const api = require('../browserApi/baseApi.js')
const messageModel = require('../model/messageModel')
const spaceModel=require('../model/spaceModel')
window.ipc=require('electron').ipcRenderer
window.tsbApi = api
window.$models = {
  messageModel,
  spaceModel
}


