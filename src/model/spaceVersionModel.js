const { SqlDb } = require('../util/sqldb')
const sqlDb = new SqlDb()
const nanoid = require('nanoid')
const standReturn = require('../util/standReturn')
const DEFAULT_LIMIT = 100 //默认保存数量
const spaceModel = require('./spaceModel')
const userModel=require('./userModel')
const cloudSpaceModel = require('./cloudSpaceModel')
const backupSpaceModel = require('./backupSpaceModel')

sqlDb.knex.schema.hasTable('space_version').then(function(exists) {
  if (!exists) {
    return sqlDb.knex.schema.createTable('space_version', function(t) {
      t.string('nanoid').primary().unique();
      t.string('name');
      t.integer('save_time');
      t.text('data')
      t.tinyint('is_conflict').defaultTo(false)
      t.string('space_id')
      t.integer('count_task')
      t.integer('count_tab')
      t.boolean('uploaded').defaultTo(false)
    });
  }
});


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
    let nowDate = new Date(now)
    let data = {
      nanoid: nanoid.nanoid(),
      name: '备份_' + (nowDate.getMonth()+1) + '月' + nowDate.getDate() + '日 ' + nowDate.getHours() + ':' + nowDate.getMinutes(),
      save_time: now,
      is_conflict,
      data: saveData.data,
      space_id: spaceId,
      count_task: saveData.count_task,
      count_tab: saveData.count_tab,
      uploaded: false
    }
    try {
      let rs = await sqlDb.knex('space_version').insert(data)
      // let settingsVersionLimit=settings.get('versionLimit')
      let limit = DEFAULT_LIMIT
      let rsLimit = await sqlDb.knex('space_version')
        .where({ 'space_id': spaceId }).whereNotIn('nanoid', function () {
          this.where({ space_id: spaceId }).orderBy('save_time', 'desc').limit(limit).from('space_version').select('nanoid')
        }).delete()
    } catch (e) {
      console.warn('存储空间版本失败', e)
      return standReturn.failure('存储失败，数据库错误')
    }
    return standReturn.success(data)
  },
  async list (spaceId) {
    try {
      rs = await sqlDb.knex('space_version').where({ space_id: spaceId }).orderBy('save_time', 'desc').select()
    } catch (e) {
      return standReturn.failure('数据库错误', e)
    }
    return standReturn.success(rs)
  },
  /**
   * 还原空间到某个版本
   * @param spaceId 空间id
   * @param versionId 版本id
   */
  async restore (spaceId, versionId, spaceType = 'local') {
    if (spaceType === 'local') {
      return await this.restoreLocal(spaceId, versionId)
    } else {
      return await this.restoreCloud(spaceId, versionId)
    }
  },
  /**
   * 还原本地空间版本
   * @param spaceId
   * @param versionId
   * @returns {Promise<{data: {}, status: number}|{data: *, status: number, info: string}>}
   */
  async restoreLocal (spaceId, versionId) {
    try {
      let version = await sqlDb.knex('space_version').where({ nanoid: versionId }).first()
      if (!version) {
        console.warn('还原本机空间失败，版本不存在', e)
        return standReturn.failure('版本不存在')
      }
      let space = await sqlDb.knex('local_space').where({ nanoid: spaceId }).first()
      let currentSpace = await spaceModel.getCurrent()
      if (!space) {
        console.warn('还原本机空间失败，本机空间不存在', e)
        return standReturn.failure('本机空间不存在')
      }
      if (currentSpace.spaceId === space.nanoid) {
        await require('electron').ipcRenderer.sendSync('closeSync')
        let rs = await sqlDb.knex('local_space').where({ nanoid: spaceId }).update({
          count_task: version.count_task,
          count_tab: version.count_tab,
          sync_time: Date.now(),
          data: version.data
        })
        space.count_task = version.count_task
        space.count_tab = version.count_tab
        space.data = version.data
        await spaceModel.setCurrentSpace(space)
        await require('electron').ipcRenderer.invoke('createWindow') //切换一下空间
      } else {
        await sqlDb.knex('local_space').where({ nanoid: spaceId }).update({
          count_task: version.count_task,
          count_tab: version.count_tab,
          sync_time: Date.now(),
          data: version.data
        })
      }
      return standReturn.success('还原成功。')
    } catch (e) {
      console.error(e)
      return standReturn.failure('还原意外失败')
    }

  },
  /**
   * 还原云空间
   * @param spaceId
   * @param versionId
   * @returns {Promise<{data: {}, status: number}|{data: *, status: number, info: string}>}
   */
  async restoreCloud (spaceId, versionId) {
    try {
      let version = await sqlDb.knex('space_version').where({ nanoid: versionId }).first()
      if (!version) {
        console.warn('还原空间失败，版本不存在', e)
        return standReturn.failure('版本不存在')
      }
      let backupSpace = await backupSpaceModel.getSpace(spaceId)
      let user = await userModel.get({ uid: backupSpace.uid })
      user.clientId=await userModel.getClientId()
      cloudSpaceModel.setUser(user)
      let spaceRs = await cloudSpaceModel.getSpace(spaceId)
      let cloudSpace
      if (spaceRs.status === 1) {
        cloudSpace = spaceRs.data
      } else {
        return standReturn.failure('获取云空间失败')
      }
      let currentSpace = await spaceModel.getCurrent()
      if (currentSpace.spaceId === spaceId) {
        await require('electron').ipcRenderer.sendSync('closeSync')
        let saveRs = await cloudSpaceModel.save(spaceId, {
          count_task: version.count_task,
          count_tab: version.count_tab,
          sync_time: Date.now(),
          data: JSON.parse(version.data)
        }, user,true)
        if (saveRs.status === 1) {
          cloudSpace.count_task = version.count_task
          cloudSpace.count_tab = version.count_tab
          cloudSpace.data = version.data
          await spaceModel.setCurrentSpace(cloudSpace)
          await require('electron').ipcRenderer.invoke('createWindow') //切换一下空间
          return standReturn.success('还原成功。')
        }
      } else {
        let saveRs = await cloudSpaceModel.save(spaceId, {
          count_task: version.count_task,
          count_tab: version.count_tab,
          sync_time: Date.now(),
          data: JSON.parse(version.data)
        }, user,true)
        if (saveRs.status === 1) {
          return standReturn.success('还原成功。')
        }
      }
      return standReturn.failure('还原失败，接口返回失败。')
    } catch (e) {
      console.error(e)
      return standReturn.failure('还原意外失败')
    }
  }
}

module.exports = spaceVersionModel
