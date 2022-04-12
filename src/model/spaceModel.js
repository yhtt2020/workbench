if (typeof window !== 'undefined') {
  ldb = window.ldb
}
const localSpaceModel = require('./localSpaceModel')
const backupSpaceModel = require('./backupSpaceModel')
const { nanoid } = require('nanoid')
const spaceModel = {
  type: 'local',
  user: {
    uid: 0
  },
  adapterModel: require('./localSpaceModel'),
  setUser (user) {
    spaceModel.user = user
    if (user.uid === 0) {
      spaceModel.setAdapter('local')
    } else {
      spaceModel.setAdapter('cloud')
    }
    return spaceModel
  },
  setAdapter (type = 'local') {
    if (type !== 'local') {
      spaceModel.type = 'cloud'
      spaceModel.adapterModel = require('./cloudSpaceModel')
    } else {
      spaceModel.type = 'local'
      spaceModel.adapterModel = require('./localSpaceModel')
    }
    return spaceModel
  },

  async getUserSpaces (option) {
    return await spaceModel.adapterModel.getUserSpaces(spaceModel.user, option)
  },

  /**
   * 获取当前空间
   */
  async getCurrent (needDetail=false) {
    ldb.reload()
    let currentSpace = ldb.db.get('currentSpace').value()
    if (!currentSpace) { //如果是首次读入，不存在currentSpace就插入一个默认的值
      currentSpace = {
        spaceId: nanoid(),
        spaceType: 'local',
        name: '默认空间',
        userInfo: {
          uid: 0
        }
      }
      ldb.db.set('currentSpace', currentSpace).write()
    }
    if(currentSpace.spaceId===-1){
      throw '空间id无效'
    }
    let space = {}
    if (currentSpace.spaceType === 'cloud') {
      //如果是云端，则从云端取
      try {
        let result = await spaceModel.setUser(currentSpace.userInfo).getSpace(currentSpace.spaceId)
        console.log(result)
        if (result.status === 1){
          if(result.data.id==='-1'){
            throw '云端空间已被删除'
          }
          space = result.data
          space.id=space.nanoid
        }
        else{
          throw '云端获取空间失败，网络错误'
        }
      } catch (e) {
        //如果没取成，则取备份空间
        space = backupSpaceModel.getSpace(currentSpace.spaceId)
        if(!!!space){
          console.error('致命错误，本地空间备份丢失')
          throw '本地备份空间丢失或不存在'
        }
      }
    } else {
      space = await spaceModel.setAdapter('local').getSpace(currentSpace.spaceId)
      if (!!!space) {
        space = {
          name: '本机空间',
          id: nanoid()
        }
        console.error('意外未能获得当前空间')
      }
      currentSpace.space = space
      currentSpace.spaceId = space.id
      currentSpace.name = space.name
      ldb.db.set('currentSpace.space', space).write()
      ldb.db.set('currentSpace.name', space.name).write()
      ldb.db.set('currentSpace.spaceId', space.id).write()
    }
    return currentSpace
  },
  async getSpace (id) {
    return spaceModel.adapterModel.getSpace(id, spaceModel.user)
  },
  async copy(space) {
    return spaceModel.adapterModel.copy(space, spaceModel.user)
  },
  async addSpace (space) {
    return spaceModel.adapterModel.addSpace(space, spaceModel.user)
  },

  getCloudSpace (nanoid) {
    return {}
  },

  async changeCurrent (space) {
    //关闭mainWindow（自动会保存）
    let result = await spaceModel.adapterModel.changeCurrent(space, spaceModel.user)
    if (result.status) {
      ipc.send('closeUserWindow')
      return result.data
    }
    //设置数据库中的当前空间
  },
  async getLocalSpaces () {
    return localSpaceModel.getAll()
  },
  async deleteSpace (space) {
    return await spaceModel.adapterModel.deleteSpace(space, spaceModel.user)
  },
  async importFromLocal (spaces) {
    return await spaceModel.adapterModel.importFromLocal(spaces, spaceModel.user)
  },
  async renameSpace (newName, space) {
    return await spaceModel.adapterModel.renameSpace(newName, space, spaceModel.user)
  },
  async getLastSyncSpace () {
    return await spaceModel.adapterModel.getLastSyncSpace()
  },
  async clientOffline () {
    return await spaceModel.adapterModel.clientOffline(spaceModel.user)
  },
  async clientOnline (nanoid, force = false) {
    return await spaceModel.adapterModel.clientOnline(nanoid, force, spaceModel.user)
  }

}

module.exports = spaceModel
