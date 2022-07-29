const knex=require('knex')
let filename = ''
if (window) {
  filename = window.globalArgs['user-data-path'] + '/db/db.sqlite'
} else {
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
}

module.exports = { SqlDb }
