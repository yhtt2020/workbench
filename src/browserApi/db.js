const PouchDB = require('pouchdb')
const path = require('path')
const fs = require('fs-extra')
const dbDir = path.join(window.globalArgs['user-data-dir'], 'pdb')
PouchDB.plugin(require('pouchdb-paginators'))
PouchDB.plugin(require('pouchdb-find'))
let pdb

const db = {
  instance: pdb,
  queue:[],
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
  async remove (docId,docRev) {
    await db.connect()
    let rs=await pdb.remove(docId,docRev)
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
    await db.close()
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
    if(db.instance?._closed || !db.instance){
      await fs.ensureDir(dbDir)
      const name = window.globalArgs['name']
      pdb = new PouchDB(path.join(dbDir, 'db.' + name))
      db.instance = pdb
      db.queue.push(Date.now())
      console.log('执行一次连接')
    }
  },
  async close () {
    db.queue.pop()
    if(db.queue.length>0){
      console.log('阻止一次关闭')
      console.log(...db.queue)
      return
    }
    console.log('执行一次关闭退出')
    if(db.instance?._closed){
    }else{
      await db.instance.close()
    }
  },
  async clear(){
    await db.connect()
    let rs=await db.allDocs()
    console.log(rs,'茶会结果')
    if(rs.rows){
      rs.rows.forEach(doc=>{
        db.remove( doc.id, doc.value.rev)
      })
    }
    await db.close()
  }
}

module.exports = db
