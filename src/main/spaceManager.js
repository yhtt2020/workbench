const fs=require('fs-extra')
const path=require('path')
const {app ,Notification}=require('electron')



const knex=require('knex')
const localSpaceModel=require('../model/localSpaceModel.js')
const spaceModel=require('../model/spaceModel.js')

const ldb=require('../util/ldb')
const backupSpaceModel = require('../model/backupSpaceModel')

class SpaceManager {
  db
  DB_ROOT=path.join(app.getPath('userData'),'db')
  DB_PATH=path.join(this.DB_ROOT,'db.sqlite')
  TPL_PATH=path.join(__dirname,'/../../db/tpl.sqlite')

  LDB_PATH=path.join(app.getPath('userData'),'ldb.json')
  constructor () {
  }
  showNotification(body,silent=true){
    new Notification({ title: '数据库转移', body: body }).show()
  }

  /**
   * 确认db存在，不存在则自动创建并完成迁移工作并返回db，已存在则直接返回db
   * @returns {Promise<*>}
   */
  async ensureDb(){
    if(!fs.existsSync(this.DB_PATH)){
        return await this.initDb()
    }else{
      this.db=this.getDbInstance()
      return this.db
    }
  }

  /**
   * 连接db，并获得db实例
   * @returns {*|Knex<any, unknown[]>}
   */
  getDbInstance(){
    return knex({
      client: 'sqlite3', // or 'better-sqlite3'
      connection: {
        filename: this.DB_PATH
      },
      useNullAsDefault:true
    })
  }

  /**
   * 初始化数据库，并插入默认空间
   * @returns {Promise<*>}
   */
  async initDb(){
    fs.ensureDirSync(this.DB_ROOT)
    fs.copyFileSync(this.TPL_PATH,this.DB_PATH)
    console.warn('由于数据库未初始化，尝试复制初始化数据库')
    this.db=this.getDbInstance()
    let spaceRs=await localSpaceModel.addSpace({
      name:'本机空间'
    })
    await spaceModel.setCurrentSpace(spaceRs.data)
    await this.migrateOldLocalSpace()

    return this.db
  }

  /**
   * 迁移老的ldb里的数据到新的数据库
   * @returns {Promise<void>}
   */
  async migrateOldLocalSpace(){
      if(fs.existsSync(this.LDB_PATH)){
        ldb.initDb()
        let current=ldb.db.get('currentSpace').value()
        if(!Object.keys(current).length>0){
          return
        }
        this.showNotification('系统检测到您是升级用户，正在为您升级数据库。请稍候。',false)
        let localSpaces=ldb.db.get('spaces').filter({type:'local'}).value()
        let spaceAddList=[]
        localSpaces.forEach((sp)=>{
          let spAdd={
            nanoid:sp.id,
            name:sp.name,
            data:JSON.stringify(sp.data),
            count_task:sp.count_task,
            count_tab:sp.count_tab,
            create_time:sp.create_time,
            update_time:sp.update_time,
            sync_time:sp.sync_time
          }

          spaceAddList.push(spAdd)
        })

        await this.db('local_space').insert(spaceAddList)
        this.showNotification('转移'+spaceAddList.length+'个本地空间完成。')
        let backupSpaces=ldb.db.get('spaces').filter({type:'cloud'}).value()
        let backupSpaceAddList=[]
        backupSpaces.forEach((sp)=>{
          let spAdd={
            nanoid:sp.id,
            name:sp.name,
            data:JSON.stringify(sp.data),
            count_task:sp.count_task,
            count_tab:sp.count_tab,
            create_time:sp.create_time,
            update_time:sp.update_time,
            sync_time:sp.sync_time,
            uid:sp.uid
          }

          backupSpaceAddList.push(spAdd)
        })
        await this.db('backup_space').insert(backupSpaceAddList)
        this.showNotification('转移'+backupSpaceAddList.length+'个备份空间完成。')
        let currentSpace= ldb.db.get('currentSpace').value()
        let space=currentSpace.space
        await spaceModel.setCurrentSpace(space)
        this.showNotification('重置数据库完成。')
      }
  }
}

module.exports= SpaceManager
