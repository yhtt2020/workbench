const knex = require('knex')

class SqlDb {
  knex
  // SqlDb 初始化
  constructor(path) {
    // 获取数据库路径
    const dbPath = path
    // 初始化knex实例
    this.knex = knex({
      client: 'sqlite3',
      connection: {
        filename: dbPath
      },
      useNullAsDefault: true
    })
    return this
  }

}

module.exports = SqlDb
