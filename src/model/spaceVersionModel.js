const { SqlDb } = require('../util/sqldb')
const sqlDb = new SqlDb()
const nanoid = require('nanoid')
const standReturn = require('../util/standReturn')
const DEFAULT_LIMIT=100 //默认保存数量
const spaceVersionModel = {
  /**
   *
   * @param spaceId
   * @param saveData
   * {
    count_task: countTask,
    count_tab: countTab,
    data: data,
    name: sessionRestore.currentSpace.name,
    type: sessionRestore.spaceType
  }
   * @param is_conflict
   * @returns {Promise<void>}
   */
  async save (spaceId, saveData, is_conflict = false) {
    let now = Date.now()
    let nowDate=new Date(now)
    let data = {
      nanoid: nanoid.nanoid(),
      name: '备份_' + nowDate.getMonth() + '月' + nowDate.getDate() + '日 ' + nowDate.getHours() + ':' + nowDate.getMinutes(),
      save_time: now,
      is_conflict,
      data:saveData.data,
      space_id: spaceId,
      count_task: saveData.count_task,
      count_tab: saveData.count_tab,
      uploaded:false
    }
    try {
      let rs = await sqlDb.knex('space_version').insert(data)
     // let settingsVersionLimit=settings.get('versionLimit')
      let limit=DEFAULT_LIMIT
      let rsLimit= await sqlDb.knex('space_version')
        .where({'space_id':spaceId}).whereNotIn('nanoid', function() {
          this.where({space_id:spaceId}).orderBy('save_time','desc').limit(limit).from('space_version').select('nanoid');
        }).delete()
    } catch (e) {
      console.warn('存储空间版本失败',e)
      return standReturn.failure('存储失败，数据库错误')
    }
    return standReturn.success(data)
  },
  async list(spaceId){
    try{
      rs=await sqlDb.knex('space_version').where({space_id:spaceId}).orderBy('save_time','desc').select()
    }catch (e) {
      return standReturn.failure('数据库错误',e)
    }
    return standReturn.success(rs)
  }
}

module.exports = spaceVersionModel
