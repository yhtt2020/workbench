class GuideModel {
  sqlDb = null
  SCHEDULE_DATA = 'guide.schedule.data'

  constructor () {
    let { SqlDb } = require('../util/sqldb')
    this.sqlDb = new SqlDb()
  }

  async getSchedule () {
    let data = await this.sqlDb.getConfig(this.SCHEDULE_DATA)
    if (!data) {
      data = {
        medal: false,
        modules: {
          noobGuide: {
            accountLogin: false,
            career: false,
            migration: false,
            adBlocking: false,
            personalise: false
          },
          feature: {
            tasks: false,
            globalSearch: false,
            desktop: false,
            userSpace: false,
            apps: false,
            team: false
          }
        },
        migration: {
          chrome: false,
          edge: false
        }
      }
      await this.setSchedule(data)
    }
    return data
  }

  async setSchedule (data) {
    await this.sqlDb.setConfig(this.SCHEDULE_DATA, data)
  }

  async setModuleKey(module,key,value=true){
    let data=await this.getSchedule()
    data.modules[module][key]=value
    await this.setSchedule(data)
  }

}

module.exports = GuideModel
