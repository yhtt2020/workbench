const db = require('../../js/util/database.js').db
const SqlDb=require('../util/sqldb').SqlDb
const sqlDb=new SqlDb()
const {nanoid}=require('nanoid')
sqlDb.knex.schema.hasTable('message').then(async function(exists) {
  if (!exists) {
    await sqlDb.knex.schema.createTable('message', function(t) {
      t.string('nanoid').primary().unique();
      t.string('type');
      t.string('avatar');
      t.integer('create_time');
      t.string('index_name');
      t.string('body');
      t.string('title');
    });
    let messages=await db.messages.orderBy('id').desc().toArray()
    //迁移数据库
    for(let i=0;i<messages.length;i++){
      let  message=messages[i]
        let data={
          avatar:message.avatar,
          body:message.body,
          nanoid:nanoid(),
          index_name:message.indexName,
          type:message.messageType,
          create_time:message.timestamp,
          title:message.title
        }
        await sqlDb.knex('message').insert(data)
      }
    console.info('迁移消息数据完毕')
  }
});



const messageModel = {

  /**
   * sqldb
   * @returns {Promise<*>}
   */
  async allList() {
    return await sqlDb.knex('message').orderBy('create_time', 'desc').select()
  },


  /**
   * sqldb 根据消息类型查询此类型的所有消息
   * @param {String} type 查询的消息类型
   */
  async findListByType(type) {
    return await sqlDb.knex('message').where({type}).orderBy('create_time', 'desc').select()
  },

  /**
   * sqldb 添加消息，支持批量添加
   * @param {(object| object[])} message 消息对象，或消息对象组成的数组
   */
  async add(message) {
    if(message.length){
      message.forEach(message=>{
        message.nanoid=nanoid()
      })
    }else{
      message.nanoid=nanoid()
    }
    return await sqlDb.knex('message').insert(message)
  },

  /**
   * sqldb 根据id删除单个消息
   * @param {number} id 消息id
   */
  async deleteById(id) {
    return await sqlDb.knex('message').where({nanoid:id}).delete()
  },

  /**
   * sqldb 根据消息类型批量删除
   * @param {string} type 删除的消息类型
   */
  async deleteByType(type) {
    return await sqlDb.knex('message').where({type}).delete()
  },

  /**
   * sqldb 清空dexie消息表单
   */
  async clearTable() {
    return await sqlDb.knex('message').delete()
  }
}


module.exports = messageModel
