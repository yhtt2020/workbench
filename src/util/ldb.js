const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const { nanoid } = require('nanoid')
const fs=require('fs')
const path=require('path')
const tables= {
  spaces:[],
  currentSpace:{},
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
      //todo 这里应该做备份还原的操作
      ldb.backUp(ldb.dbPath)
      fs.rmSync(ldb.dbPath)
      const adapter=new FileSync(ldb.dbPath)
      ldb.db=low(adapter)
      ldb.initDb()
    }

    return ldb
  },
  backUp(dbPath){
    if(fs.existsSync(dbPath)){
      dbPath=dbPath.replaceAll('\\','/')
      let dbParent=dbPath.substring(0,dbPath.lastIndexOf('/'))
      let dbName=dbPath.substring(dbPath.lastIndexOf('/')+1,dbPath.lastIndexOf('.'))
      let bkPath=path.join(dbParent,dbName+'_bk_'+Date.now()+'.json')
      fs.cpSync(dbPath,bkPath)
    }
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
