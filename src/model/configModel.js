const SqlDb=require('../util/sqldb').SqlDb
const sqlDb=new SqlDb()

const configModel = {

  async setShowOnStart (value) {
    return await sqlDb.setConfig('system.user.showOnStart',value)
  },
  async getShowOnStart () {
    return await sqlDb.getConfig('system.user.showOnStart')
  },
}

module.exports = configModel
