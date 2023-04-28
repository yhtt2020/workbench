const util=require('../util/util.js')
const tools=util.tools
window=tools.getWindowArgs(window)
window.$models= {
  appModel: require('../model/appModel'),
  settingModel:require('../model/settingModel.js'),
  placesModel:require('../../pages/util/model/placesModel.js'),
  statsh: require('../../js/util/statsh/statsh.js')
}
window.$models.appModel.initDb()
