const knex = require('knex')
const { nanoid } = require('nanoid')
const dbUtil=require('../util/dbUtil')

class SqlDb {
  knex
  constructor (dbName='db') {
    const dbPath = dbUtil.getDbPath(dbName)
    console.log(dbPath,'需要初始化一个 dbpath= 的数据库')
    this.knex = knex({
      client: 'sqlite3',
      connection: {
        filename: dbPath
      },
      useNullAsDefault: true
    })
    return this
  }

  /**
   * 便捷操作config的方法，仅限默认db使用
   * @param key 键名 三段式包名结构，参考system.space.currentUser
   * @param defaultValue
   */
  async getConfig (key, defaultValue) {
    try {
      var configData = await this.knex('config').where({
        key
      }).first()
    } catch (e) {
      console.error(e)
    }
    if (!!configData) {
      return JSON.parse(configData.value)
    } else {
      return defaultValue
    }
  }

  /**
   * 设置一个设置值，仅限默认db
   * @param key 键名 三段式包名结构，参考system.space.currentUser [system or app].[模块].[名称]
   * @param value
   * @param remark
   * @returns {Promise<void>}
   */
  async setConfig (key, value, remark = '') {
    let find = await this.knex('config').where({
      key
    }).first()
    if (!!!find) {
      try {
        await this.knex('config').insert({
          nanoid: nanoid(),
          key,
          value: JSON.stringify(value),
          remark
        })
      } catch (e) {
        console.error('设置configerror=', e)
      }
    } else {
      try {
        await this.knex('config').where({
          key
        }).update({
          key,
          value: JSON.stringify(value)
        })
      } catch (e) {
        console.error('更新configerror=', e)
      }

    }
  }
}

module.exports = { SqlDb }
