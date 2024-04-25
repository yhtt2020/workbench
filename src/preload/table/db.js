const PouchDB = require('pouchdb')
const path = require('path')
const fs = require('fs-extra')

class Db {
  instance
  id
  appInfo

  constructor (id, appInfo) {
    this.appInfo = appInfo
    this.id = id
  }

  async connect () {
    const dbDir = path.join(window.globalArgs['user-data-dir'], 'pdb')
    await fs.ensureDir(dbDir)
    const name = this.appInfo.name
    console.log('创建数据库的路径=', path.join(dbDir, 'db.table_app_' + name))
    this.instance = new PouchDB(path.join(dbDir, 'db.table_app_' + name), {
      adapter: 'leveldb'
    })

  }

  async put (doc) {
    await this.connect()
    let rs=await this.instance.put(doc)
    await tshi.close()
    return rs
  }
  async get (id) {
    await this.connect()
    let rs=await this.instance.get(id)
    await this.close()
    return rs
  }
  async remove (doc) {
    await this.connect()
    let rs=await this.instance.remove(doc)
    await this.close()
    return rs
  }
  async bulkDocs (docs) {
    await this.connect()
    let rs=await this.instance.bulkDocs(docs)
    await this.close()
    return rs
  }
  async find (options) {
    await this.connect()
    let rs=await this.instance.find(options)
    await this.connect()
    return rs
  }
  async createIndex (options) {
    await this.connect()
    let rs=await this.instance.createIndex(options)
    await this.close()
    return rs
  }
  async allDocs (key) {
    await this.connect()
    let rs
    if (!key) {
      rs=await this.instance.allDocs()
    }
    if (typeof key === 'string') {
      rs=await this.instance.allDocs({
        include_docs: true,
        start_key: key,
        end_key: key + '\ufff0'
      })
    } else {
      rs=await this.instance.allDocs({
        keys: key,
        include_docs: true,
      })
    }
    await this.close()
    return rs
  }
  async allDocsQuery (options) {
    await this.connect()
    let rs=await this.instance.allDocs(options)
    await this.close()
    return rs
  }
  async close () {
    await this.instance.close()
  }
}

module.exports = Db
