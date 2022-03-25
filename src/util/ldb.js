const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const tables= {
  spaces:[],
  currentSpace:{
    spaceId:1,
    spaceType:'local'
  }
}
let ldb = {
  db: null,//db实例，为了方便使用，去掉了Instance单词，简化成了db
  dbPath:'',
  load (dbPath){
    ldb.dbPath=dbPath
    const adapter=new FileSync(ldb.dbPath)
    ldb.db=low(adapter)
    ldb.initDb()
    return ldb
  },
  initDb(){
    ldb.db.defaults(tables).write()
    //修正错误数据
    ldb.repaireDb()
  },
  /**
   * 修复数据库的数据
   */
  repaireDb(){

  },
  /**
   * 重载最新的数据
   */
  reload(){
    ldb.load(ldb.dbPath)
  }
}

module.exports=ldb
