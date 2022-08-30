const { nanoid } = require('nanoid')
const standReturn = require('../util/standReturn')
const spaceApi = require('../api/spaceApi')
if (typeof window !== 'undefined') {
  ldb = window.ldb
}
const { SqlDb }=require('../util/sqldb')
const userModel = require('./userModel')
let sqlDb=new SqlDb()
/**
 * 备份空间，单独列开一个模型，以免与本地空间混淆
 * @type {{setOfflineUse(*=): void}}
 */
const backupSpaceModel = {
  /**
   * 设置空间未离线使用
   * @param spaceId
   */
  setOfflineUse (spaceId) {
    ldb.reload()
    ldb.db.get('spaces').find({ id: spaceId }).assign({ 'offlineUse': true }).write()
  },
  /**
   * 设置空间未离线使用，更新sqlite
   * @param spaceId
   */
  async cancelOfflineUse (spaceId) {
    ldb.reload()
    sqlDb.knex('backup_space').where({ nanoid: spaceId }).update({ 'offlineUse': false })
  },
  /**
   * 获得某个空间是否是离线可用，更新sqlite
   * @param spaceId
   * @returns {boolean}
   */
  async getOfflineUse (spaceId) {
    ldb.reload()
    let space = await sqlDb.knex('backup_space').where({ nanoid: spaceId }).first()
    if (!!!space) {
      return false
    }
    return space.offlineUse
  },

  /**
   * 获取空间，已更新至sqlite
   * @param nanoid
   * @returns {null|*}
   */
  async getSpace (nanoid) {
    let space = await sqlDb.knex('backup_space').where({ nanoid: nanoid }).first()
    if (space) {
      space.userInfo=userModel.get({uid:space.uid})
      space.userInfo.clientId=userModel.getClientId()
      return space
    } else {
      return null
    }
  },

  /**
   * 存入空间，已更新至sqlite
   * @param space
   * @param saveData
   * @returns {Promise<{nanoid: *, uid: *, count_tab: *, update_time: number, data: *, create_time: number, name, count_task: *, sync_time: number}>}
   */
  async save (space, saveData) {
    let foundSpace = await sqlDb.knex('backup_space').where({ nanoid: space.nanoid }).first()
    saveData.data
    if (foundSpace) {
      let updateData={
        update_time: Date.now(),
        data:JSON.stringify(saveData.data),
        count_tab:saveData.count_tab,
        count_task:saveData.count_task,
        sync_time:saveData.sync_time
      }
     await sqlDb.knex('backup_space').where({ nanoid: space.nanoid }).update(updateData)
    } else {
      if (!space.nanoid) {
        throw Error('备份空间id错误')
      }
      let newSpace = {
        nanoid: space.nanoid,
        data: saveData.data,
        name: space.name || '备份空间',
        count_task: saveData.count_task,
        count_tab: saveData.count_tab,
        create_time: Date.now(),
        update_time: Date.now(),
        sync_time: Date.now(),
        uid: space.uid
      }
      try{
        let result=await sqlDb.knex('backup_space').insert(newSpace)
        if(result.length>0){
          return newSpace
        }
      }catch (e) {
        console.warn(e)
      }

    }
  },
  /**
   * 复制到本地空间，更新sqlite
   * @param spaceId
   * @param name
   * @returns {Promise<{data: {}, status: number}|{data: *, status: number, info: string}>}
   */
  async copyById (spaceId, name) {
    let sourceSpace =await backupSpaceModel.getSpace(spaceId)
    if (!!!sourceSpace) {
      return standReturn.failure('空间不存在')
    }
    let targetSpace = JSON.parse(JSON.stringify(sourceSpace))
    targetSpace.nanoid = nanoid()
    targetSpace.name = name || targetSpace.name + '_副本'
    targetSpace.uid = 0
    delete targetSpace.uid
    delete targetSpace.userInfo
    delete targetSpace.offlineUse
    targetSpace.update_time = Date.now()
    await sqlDb.knex('local_space').insert(targetSpace)
    return standReturn.success(targetSpace)
  },
  /**
   * 复制一份到云端
   * @param spaceId
   * @param name
   * @returns {Promise<{data: {}, status: number}|{data: *, status: number, info: *}|{data: *, status: number, info: *}>}
   */
  async copyToCloudById (spaceId, name) {
    try {
      ldb.reload()
      let sourceSpace = backupSpaceModel.getSpace(spaceId)
      if (!!!sourceSpace) {
        return standReturn.failure('空间不存在')
      }
      let targetSpace = JSON.parse(JSON.stringify(sourceSpace))
      delete targetSpace.id
      targetSpace.type = 'cloud'
      targetSpace.name = name || targetSpace.name + '_副本'
      let apiResult = await spaceApi.copyBySpace(targetSpace, targetSpace.userInfo)
      return standReturn.autoReturn(apiResult)
    } catch (e) {
      return standReturn.failure('意外错误')
    }

  }
}

module.exports = backupSpaceModel
