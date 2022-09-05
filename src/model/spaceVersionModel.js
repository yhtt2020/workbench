const { SqlDb } = require('../util/sqldb')
const sqlDb = new SqlDb()
const nanoid = require('nanoid')
const standReturn = require('../util/standReturn')
const DEFAULT_LIMIT=100 //默认保存数量
const spaceModel=require('./spaceModel')
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
  },
  /**
   * 还原空间到某个版本
   * @param spaceId 空间id
   * @param versionId 版本id
   */
  async restore(spaceId,versionId,spaceType='local'){
    if(spaceType==='local'){
      return await this.restoreLocal(spaceId,versionId)
    }else{
      this.restoreCloud(spaceId,versionId)
      console.log('是云空间',this.activeSpace)
    }
  },
  async restoreLocal(spaceId,versionId){
    try{
      let version=await sqlDb.knex('space_version').where({nanoid:versionId}).first()
      if(!version){
        console.warn('还原本机空间失败，版本不存在',e)
        return standReturn.failure('版本不存在')
      }
      let space =await sqlDb.knex('local_space').where({nanoid:spaceId}).first()
      let currentSpace=await spaceModel.getCurrent()
      if(!space){
        console.warn('还原本机空间失败，本机空间不存在',e)
        return standReturn.failure('本机空间不存在')
      }
      if(currentSpace.spaceId===space.nanoid){
        await require('electron').ipcRenderer.sendSync('closeSync')
        let rs=await sqlDb.knex('local_space').where({nanoid:spaceId}).update({
          count_task:version.count_task,
          count_tab:version.count_tab,
          sync_time:Date.now(),
          data:version.data
        })
        space.count_task=version.count_task
        space.count_tab=version.count_tab
        space.data=version.data
        await spaceModel.setCurrentSpace(space)
        await require('electron').ipcRenderer.invoke('createWindow') //切换一下空间
      }else{
        await sqlDb.knex('local_space').where({nanoid:spaceId}).update({
          count_task:version.count_task,
          count_tab:version.count_tab,
          sync_time:Date.now(),
          data:version.data
        })
      }
      return standReturn.success('还原成功。')
    }catch (e) {
      console.error(e)
      return standReturn.failure('还原意外失败')
    }

  },
  restoreCloud(spaceId,versionId){

  }
}

module.exports = spaceVersionModel
