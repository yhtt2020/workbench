const _ = require('lodash')
const { SqlDb } = require('../util/sqldb')
const { nanoid } = require('nanoid')
const standReturn = require('../util/standReturn')

/**
 * 简易存储模块，简易存储，无需复杂存储
 */
class StorageModel {
  cache={} //缓存
  db
  async initDb(){
    this.db = new SqlDb('storage')
    let exists = await this.db.knex.schema.hasTable('storage')
    if (!exists) {
      await this.db.knex.schema.createTable('storage', function (t) {
        t.string('nanoid').primary().unique() //本地id
        t.string('sign')//一般用于标志，如果无，则为通用存储，可使用任何的存储方式
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
   * @param sign
   * @returns {Promise<*>}
   */
  async getItem(key,sign=null){
    let found=await  this.db.knex('storage').where({key,sign}).first()
    if(found){
      return found['value']
    }else{
      return null
    }

  }

  /**
   * 支持自动序列化对象值value
   * @param key
   * @param value
   * @param domain 跨站的值可留空
   * @returns {*}
   */
  async setItem(key,value,sign){
    let cacheValue=this.cache[`${key}_${sign}`]
    if(cacheValue){
      //如果已经存在缓存，且缓存与当前一致，则不写入
      if(cacheValue===value){
        return
      }
    }
    this.cache[`${key}_${sign}`]=value
    if(typeof value==='object'){
      value=JSON.stringify(value)
    }
    let found= await this.db.knex('storage').where({key,sign}).first()
    if(found){
      return this.db.knex('storage').where({key,sign}).update({value})
    }else{
      return this.db.knex('storage').insert({value,key,sign,nanoid:nanoid(8)})
    }
  }
}

module.exports=StorageModel
