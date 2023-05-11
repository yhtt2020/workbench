const SqlDb=require('../util/sqldb').SqlDb
const sqlDb=new SqlDb()
const { nanoid }=require('nanoid')
class SettingModel {

  async initDb(){
    let exists = await sqlDb.knex.schema.hasTable('setting')
    if (!exists) {
      console.log('检测到setting表不存在，自动创建')
      await sqlDb.knex.schema.createTable('setting', function (t) {
        t.string('nanoid').primary().unique() //本地id
        t.string('sign').comment('标记，用于区隔，例如不同的应用，sign-group-key结合才是最终定位一个配置的关键')
        t.string('group').comment('标记，用于区隔，例如不同的应用，sign-group-key结合才是最终定位一个配置的关键')
        t.string('key').comment('键名，可采用x.x.x结构')
        t.string('value').comment('值')
        t.string('create_time').comment('创建日期')
        t.string('update_time').comment('更新日期')
        t.string('sync_time').comment('同步日期')
        t.string('uid').comment('用户uid，不写则是不限用户')
        t.string('comment').comment('注释，便于理解')
      })
      await this.migrateDB()
      //todo 迁移
    }else{
      //防止迁移失败导致未成功转入应用
      await this.migrateDB()
    }
  }

  migrateDB(){

  }

  async getAll(sign='',group){
    let where={}
    if(sign){
      where['sign']=sign
    }
    where['group']=group
    return await sqlDb.knex('setting').where(where).select()
  }



  async get(sign,group,key){
    if(!!!key){
      throw '键名必须提供'
    }
    let map={}
    if(sign){
      map.sign=sign
    }
    map.key=key
    map.group=group

    let record= await sqlDb.knex('setting').where(map).first()
    if(record){
      return JSON.parse(record.value)
    }else{
      return undefined
    }
  }

  /**
   *
   * @param sign 标记
   * @param group  组
   * @param key
   * @param value 值
   * @returns {Promise<*>}
   */
  async set(sign,group,key,value){
    if(!!!key){
      throw '必须提供key和值'
    }
    if(!!!key){
      throw '键名必须提供'
    }
    let map={}
    if(sign){
      map.sign=sign
    }
    map.key=key
    map.group=group
    if(!(await sqlDb.knex('setting').where(map).first())){
      return await sqlDb.knex('setting').insert({
        value:JSON.stringify(value),key,group,sign,
        nanoid:nanoid(6),
        create_time:Date.now(),
        update_time:Date.now()
      })
    }

    return await sqlDb.knex('setting').where(map).update({
      value:JSON.stringify(value),
      update_time:Date.now()
    })
  }

  /**
   *
   * @param sign 标记
   * @param group 组
   * @param key 键名
   * @returns {Promise<*>}
   */
  async remove(sign,group,key){
    if(!!!key || !!!sign || !!!group){
      throw '必须提供key，group，sign和值'
    }

    return await sqlDb.knex('setting').where({
      key,group,sign
    }).delete()
  }

  async clear(sign,group,key){
    let map={
    }
     if (sign) map.sign=sign
    if (group) map.group=group
    if (key) map.key=key
    console.log(map)
    return await sqlDb.knex('setting').where(map).delete()
  }


}

module.exports =SettingModel
