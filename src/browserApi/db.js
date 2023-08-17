const PouchDB = require('pouchdb')
const path=require('path')
const fs=require('fs-extra')
const dbDir=path.join(window.globalArgs['user-data-dir'],'pdb')
let pdb
fs.ensureDir(dbDir).then((rs)=>{
  const name = window.globalArgs['name']
  pdb = new PouchDB(path.join(dbDir,'db.' + name))
})

const db = {
  instance: pdb,
  put (doc) {
   return pdb.put(doc)
  },
  get (id) {
    return pdb.get(id)
  },
  remove (doc) {
    return pdb.remove(doc)
  },
  bulkDocs (docs) {
    return pdb.bulkDocs(docs)
  },
  allDocs (key) {
    if(!key){
      return pdb.allDocs()
    }
    if(typeof key ==='string')
    {
      return pdb.allDocs({
        include_docs:true,
        start_key:key,


      })
    }else{
      return pdb.allDocs({
        keys:key
      })
    }
  },
  allDocsQuery(options){
    return pdb.allDocs(options)
  }
}

module.exports = db
