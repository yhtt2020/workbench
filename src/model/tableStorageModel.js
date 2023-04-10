const _ = require('lodash')
const { SqlDb } = require('../util/sqldb')
const { nanoid } = require('nanoid')
const standReturn = require('../util/standReturn')

class tableStorageModel {
  async initDb(){
    this.db = new SqlDb('table')
    let exists = await this.db.knex.schema.hasTable('storage')
    if (!exists) {
      await this.db.knex.schema.createTable('storage', function (t) {
        t.string('nanoid').primary().unique() //本地id
        t.string('domain')//域名，如果无，则为通用存储
        t.string('key')//键名
        t.string('value') //键值，json会自动序列化，但是读取的时候仍然为string
      })
      //await this.migrateDB()
      //todo 迁移
    } else {
      //防止迁移失败导致未成功转入应用
      //await this.migrateDB()
    }
  }

  /**
   * 注意，取出的所有值均为string，需要自行反序列化
   * @param key
   * @param domain 跨站的值可留空
   * @returns {Promise<*>}
   */
  async getItem(key,domain=null){
    return this.db.knex('storage').where({key,domain}).first()
  }

  /**
   * 支持自动序列化对象值value
   * @param key
   * @param value
   * @param domain 跨站的值可留空
   * @returns {*}
   */
  setItem(key,value,domain){
    if(typeof value==='object'){
      value=JSON.stringify(value)
    }
    return this.db.knex('storage').where({key,domain}).update({value})
  }
}
