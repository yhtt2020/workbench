const _ = require('lodash')
const { SqlDb } = require('../util/sqldb')
const { nanoid } = require('nanoid')
const standReturn = require('../util/standReturn')

class WatchTaskModel {
  db

  async initDb(){
    this.db = new SqlDb('watch')
    const watchDb = this.db
    let exists = await watchDb.knex.schema.hasTable('data')
    if (!exists) {
      await watchDb.knex.schema.createTable('data', function (t) {
        t.string('nanoid').primary().unique() //本地id
        t.string('task_id')//对应发task_id
        t.integer('grab_time') //抓取的时间
        t.string('type')//数据类型， start interval timeout
        t.string('data')//抓取到的数据 失败则写失败原因
        t.string('status')//失败error 成功不写值
      })
      //await this.migrateDB()
      //todo 迁移
    } else {
      //防止迁移失败导致未成功转入应用
      //await this.migrateDB()
    }
  }

  async updateLastExecute(taskId,data){
    await this.db.knex('task').where({nanoid:taskId}).increment('executed_times')
    await this.db.knex('task').where({nanoid:taskId}).update({last_execute_time:Date.now(),last_data:JSON.stringify(data)})
  }

  async add (taskId, data,type) {
    if(type==='start'){
      //只更新start，不更新interval
      this.updateLastExecute(taskId,data).then()
    }
    return await this.db.knex('data').insert({
      nanoid: nanoid(8),
      task_id: taskId,
      grab_time: Date.now(),
      data: JSON.stringify(data),
      type
    })

  }
  async addError (taskId, data,type) {
    if(type==='start'){
      //只更新start，不更新interval
      this.updateLastExecute(taskId,data).then()
    }
    return await this.db.knex('data').insert({
      nanoid: nanoid(8),
      task_id: taskId,
      grab_time: Date.now(),
      data: JSON.stringify(data),
      status: 'error',
      type
    })

  }

  async getLatestStart(taskId,type){
    let records= await this.db.knex('data').whereNull('status').where({ task_id: taskId,type}).orderBy('grab_time','desc').limit(1).select()
    if(records){
      if(records.length===1){
        return records[0]
      }
    }else{
      return null
    }
  }

}

module.exports = WatchTaskModel
