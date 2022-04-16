const { nanoid } = require('nanoid')
const standReturn = require('../util/standReturn')
const spaceApi = require('../../pages/util/api/spaceApi')
if (typeof window !== 'undefined') {
  ldb = window.ldb
}
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
   * 设置空间未离线使用
   * @param spaceId
   */
  cancelOfflineUse (spaceId) {
    ldb.reload()
    ldb.db.get('spaces').find({ id: spaceId }).assign({ 'offlineUse': false }).write()
  },
  /**
   * 获得某个空间是否是离线可用
   * @param spaceId
   * @returns {boolean}
   */
  getOfflineUse (spaceId) {
    ldb.reload()
    let space = ldb.db.get('spaces').find({ id: spaceId }).value()
    if (!!!space) {
      return false
    }
    return space.offlineUse
  },

  getSpace (id) {
    ldb.reload()
    let space = ldb.db.get('spaces').find({ id: id }).value()
    if (space) {
      if (space.type === 'cloud' && space.nanoid) {
        space.id = space.nanoid
      }
      return space
    } else {
      return null
    }
  },

  save (space, saveData) {
    ldb.reload()
    let foundSpace = ldb.db.get('spaces').find({ id: space.id }).value()
    if (foundSpace) {
      saveData.update_time = Date.now()
      saveData.sync_time = Date.now()
      ldb.db.get('spaces').find({ id: space.id }).assign(saveData).write()
    } else {
      if (!space.id) {
        throw Error('备份空间id错误')
      }
      let newSpace = {
        id: space.id,
        data: saveData.data,
        name: space.name || '备份空间',
        count_task: saveData.count_task,
        count_tab: saveData.count_tab,
        create_time: Date.now(),
        update_time: Date.now(),
        sync_time: Date.now(),
        type: 'cloud',
        uid: space.uid,
        userInfo: space.userInfo
      }
      ldb.db.get('spaces').push(newSpace).write()
    }
  },
  copyById (spaceId, name) {
    ldb.reload()
    let sourceSpace = backupSpaceModel.getSpace(spaceId)
    if (!!!sourceSpace) {
      return standReturn.failure('空间不存在')
    }
    let targetSpace = JSON.parse(JSON.stringify(sourceSpace))
    targetSpace.id = nanoid()
    targetSpace.type = 'local'
    targetSpace.name = name || targetSpace.name + '_副本'
    targetSpace.uid = 0
    delete targetSpace.userInfo
    delete targetSpace.offlineUse
    targetSpace.update_time = Date.now()
    ldb.db.get('spaces').push(targetSpace).write()
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