
if (typeof window !=='undefined') {
  ldb = window.ldb
}else{
  const app=require('electron').app
  var  ldb=require('../util/ldb')
  ldb.load(app.getPath('userData')+'/ldb.json')
}
const configModel = {

  setShowOnStart (value) {
    ldb.reload()
    return ldb.db.set('config.showOnstart', value).write()
  },
  getShowOnStart () {
    ldb.reload()
    return ldb.db.get('config.showOnstart').value()
  },
  set(key,value){
    ldb.reload()
    return ldb.db.set(`config.${key}`,value).write()
  },
  get(key){
    ldb.reload()
    return ldb.db.get(`config.${key}`).value()
  }
}

module.exports = configModel
