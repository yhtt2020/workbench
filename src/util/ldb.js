const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const { nanoid } = require('nanoid')
const tables= {
  spaces:[],
  currentSpace:{
    spaceId:1,
    spaceType:'local'
  },
  users:[],
  config:{}
}

let ldb = {
  db: null,//db实例，为了方便使用，去掉了Instance单词，简化成了db
  dbPath:'',
  loadInWindow(){
    if(window){
      ldb.load(window.globalArgs['user-data-path']+'/ldb.json')
    }
  },
  load (dbPath){
    try{
      ldb.dbPath=dbPath
      const adapter=new FileSync(ldb.dbPath)
      ldb.db=low(adapter)
      ldb.initDb()
    }catch (e) {
      console.log(require('fs').readFileSync(ldb.dbPath, 'utf-8').trim())
      console.log(e)
    }

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
    ldb.db.get('spaces').filter((item)=>{
      if(!item.id){
        return true
      }
    }).each((space)=>{
      space.id=nanoid()
    }).write()
  },
  /**
   * 重载最新的数据
   */
  reload(){
    ldb.load(ldb.dbPath)
  }
}

module.exports=ldb
