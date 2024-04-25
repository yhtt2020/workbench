const PouchDB = require('pouchdb')
const path = require('path')
const fs = require('fs-extra')
const dbDir = path.join(window.globalArgs['user-data-dir'], 'pdb')
PouchDB.plugin(require('pouchdb-paginators'))
PouchDB.plugin(require('pouchdb-find'))
let pdb

const db = {
  instance: pdb,
  async put (doc) {
    await db.connect()
    let rs=await pdb.put(doc)
    await db.close()
    return rs
  },
  async get (id) {
    await db.connect()
    let rs=await pdb.get(id)
    await db.close()
    return rs
  },
  async remove (doc) {
    await db.connect()
    let rs=await pdb.remove(doc)
    await db.close()
    return rs
  },
  async bulkDocs (docs) {
    await db.connect()
    let rs=await pdb.bulkDocs(docs)
    await db.close()
    return rs
  },
  async find (options) {
    await db.connect()
    let rs=await pdb.find(options)
    await db.connect()
    return rs
  },
  async createIndex (options) {
    await db.connect()
    let rs=await pdb.createIndex(options)
    await db.close()
    return rs
  },
  async allDocs (key) {
    await db.connect()
    let rs
    if (!key) {
      rs=await pdb.allDocs()
    }
    if (typeof key === 'string') {
      rs=await pdb.allDocs({
        include_docs: true,
        start_key: key,
        end_key: key + '\ufff0'
      })
    } else {
      rs=await pdb.allDocs({
        keys: key
      })
    }
    await db.close()
    return rs
  },
  async allDocsQuery (options) {
    await db.connect()
    let rs=await pdb.allDocs(options)
    await db.close()
    return rs
  },
  async connect () {
    await fs.ensureDir(dbDir)
    const name = window.globalArgs['name']
    pdb = new PouchDB(path.join(dbDir, 'db.' + name))
    db.instance = pdb
  },
  async close () {
    await db.instance.close()
  }
}

module.exports = db
