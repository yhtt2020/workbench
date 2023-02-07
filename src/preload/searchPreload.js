window.$models= {
  appModel: require('../model/appModel'),
  settingModel:require('../model/settingModel.js'),
  placesModel:require('../../pages/util/model/placesModel.js')
}
window.$models.appModel.initDb()
