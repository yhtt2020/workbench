const knex = require('knex')
const { nanoid } = require('nanoid')
let filename
if (typeof window !=='undefined') {
  filename = window.globalArgs['user-data-path'] + '/db/db.sqlite'
} else {
  const path=require('path')
  const app=require('electron').app
  filename = path.join(app.getPath('userData'), 'db/db.sqlite')
}

class SqlDb {
  knex
  constructor () {
    this.knex = knex({
      client: 'sqlite3',
      connection: {
        filename: filename
      },
      useNullAsDefault: true
    })
    return this
  }

  /**
   * 便捷操作config的方法
   * @param key 键名 三段式包名结构，参考system.space.currentUser
   * @param defaultValue
   */
  async getConfig (key, defaultValue) {
    let configData = await this.knex('config').where({
      key
    }).first()
    console.log('configData',configData)
    if (!!configData) {
      return JSON.parse(configData.value)
    } else {
      return defaultValue
    }
  }

  /**
   * 设置一个设置值
   * @param key 键名 三段式包名结构，参考system.space.currentUser [system or app].[模块].[名称]
   * @param value
   * @param remark
   * @returns {Promise<void>}
   */
  async setConfig (key, value, remark) {
    let find = await this.knex('config').where({
      key
    }).first()
    if (!!!find) {
      await this.knex('config').insert({
        nanoid: nanoid(),
        key,
        value:JSON.stringify(value),
        remark
      })
    } else {
      await this.knex('config').where({
        key
      }).update({
        key,
        value:JSON.stringify(value)
      })

    }
  }
}

module.exports = { SqlDb }
