const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const initialTable = {
  guideSchedule: {}
}

let markdb = {
  db:null,
  markPath:'',
  init (path) {
    markdb.markPath= path
    const adapter=new FileSync(path + '/markdb.json')
    markdb.db = low(adapter)

    const resData = markdb.db.get('guideSchedule').value()

    if(!resData) {
      markdb.db.defaults(initialTable).write()
    }
  }
}

module.exports = markdb
