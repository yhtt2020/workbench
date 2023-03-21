const SettingModel = require('./settingModel.js')
const _ = require('lodash')
let filename
if (typeof window !=='undefined') {
  window=require('./util').tools.getWindowArgs(window)
  filename = window.globalArgs['user-data-path'] + '/db/db.sqlite'
} else {
  const path=require('path')
  const app=require('electron').app
  const isDevelopmentMode = process.argv.some(arg => arg === '--development-mode')
  if (isDevelopmentMode) {
    filename = path.join(app.getPath('userData') + '-development', 'db/watch.sqlite')
  }else{
    filename = path.join(app.getPath('userData'), 'db/watch.sqlite')
  }
}
const { SqlDb } = require('../util/sqldb')
const path = require('path')
const { app } = require('electron')
const sqlDb = new SqlDb(filename)
let settingModel
class WatchTaskModel {
  async initDb () {
    settingModel = new SettingModel()
    await settingModel.initDb()

    let exists = await sqlDb.knex.schema.hasTable('watchTask')
    if (!exists) {
      console.info('检测到app表不存在，自动创建')
      await sqlDb.knex.schema.createTable('watchTask', function (t) {
        t.string('nanoid').primary().unique() //本地id
        t.string('app')//appstore的应用id
        t.string('title')
        t.string('name')
        t.string('url')
        t.integer('interval')//抓取频率
        t.string('logo')
        t.string('summary')
        t.integer('create_time')
        t.integer('update_time')
        t.integer('order')
        t.integer('last_execute_time')
        t.string('options')
      })
      //await this.migrateDB()
      //todo 迁移
    } else {
      //防止迁移失败导致未成功转入应用
      //await this.migrateDB()
    }
  }
  async add(task){

  }

}

module.exports = WatchTaskModel
