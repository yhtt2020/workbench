const _ = require('lodash')
const { SqlDb } = require('../util/sqldb')
const { nanoid } = require('nanoid')
const standReturn = require('../util/standReturn')

class WatchTaskModel {
  db

  async initDb () {
    this.db = new SqlDb('watch')
    console.log(this.db,'初始化一个db')
    const watchDb = this.db
    let exists = await watchDb.knex.schema.hasTable('task')
    if (!exists) {
      console.info('检测到app表不存在，自动创建')
      await watchDb.knex.schema.createTable('task', function (t) {
        t.string('nanoid').primary().unique() //本地id
        t.string('app_id')//appstore的应用id
        t.string('title')
        t.string('name')
        t.string('url')
        t.integer('interval')//抓取频率，秒为单位，这里是指的整个页面刷新，而不是页面内的interval，页面内的interval并不会刷新整个页面，页面内的刷新由开发者控制
        t.string('cover')//任务封面
        t.string('summary')
        t.integer('last_execute_time') //上次运行时间
        t.integer('executed_time_length')//运行总时长
        t.integer('executed_times') //运行次数
        t.integer('create_time')
        t.integer('update_time')
        t.integer('order')
        t.boolean('running')//运行中
        t.string('options')
      })
      //await this.migrateDB()
      //todo 迁移
    } else {
      //防止迁移失败导致未成功转入应用
      //await this.migrateDB()
    }
  }

  /**
   * 添加一个任务
   * @param task
   * @returns {Promise<void>}
   */
  async add (task) {
    let addTask = {
      nanoid: nanoid(8),
      title: task.title,
      app_id: '1',
      url: task.url,
      cover: '',
      interval: task.interval,
      summary: task.summary,
      create_time: Date.now(),
      update_time: Date.now(),
      executed_times: 0,
      order: 1,
      last_execute_time: null,
      options: JSON.stringify(task.options || {})
    }
    console.log(addTask)
    try {
      let result = await this.db.knex('task').insert(addTask)
      if (result) {
        return standReturn.success()
      } else {
        return standReturn.failure('')
      }
    } catch (e) {
      return standReturn.failure('', e)
    }

  }

  async listAllTasks () {
    return this.db.knex('task').orderBy('last_execute_time','desc').select()
  }

  async startTask(nanoid){
    return this.db.knex('task').where({nanoid:nanoid}).update({running:true})
  }

}

module.exports = WatchTaskModel
