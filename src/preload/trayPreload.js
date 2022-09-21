const api = require('../browserApi/baseApi.js')
const messageModel = require('../model/messageModel')
const spaceModel=require('../model/spaceModel')
window.api = api
window.$models = {
  messageModel,
  spaceModel
}


