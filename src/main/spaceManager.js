const fs=require('fs-extra')
const path=require('path')
const app=require('electron').app



const knex=require('knex')
const localSpaceModel=require('../model/localSpaceModel.js')
const spaceModel=require('../model/spaceModel.js')
class SpaceManager {
  db
  DB_ROOT=path.join(app.getPath('userData'),'db')
  DB_PATH=path.join(this.DB_ROOT,'db.sqlite')
  TPL_PATH=path.join(__dirname,'/../../db/tpl.sqlite')
  constructor () {
  }

  /**
   * 确认db存在，不存在则自动创建并完成迁移工作并返回db，已存在则直接返回db
   * @returns {Promise<*>}
   */
  async ensureDb(){
    console.log(this.DB_PATH)
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
    console.warn('插入了一个初始空间')
    await spaceModel.setCurrentSpace(spaceRs.data)
    return this.db
  }

  /**
   * 迁移老的ldb里的数据到新的数据库
   * @returns {Promise<void>}
   */
  async migrateOldLocalSpace(){

  }
}

module.exports= SpaceManager
