if (typeof window !=='undefined') {
  ldb = window.ldb
}
const localSpaceModel = require('./localSpaceModel')

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

  async getUserSpaces () {
    return await spaceModel.adapterModel.getUserSpaces(spaceModel.user)
  },

  /**
   * 获取当前空间
   */
  async getCurrent () {
    ldb.reload()
    let currentSpace = ldb.db.get('currentSpace').value()
    if (!currentSpace) { //如果是首次读入，不存在currentSpace就插入一个默认的值
      currentSpace = {
        spaceId: 1,
        spaceType: 'local',
        name:'本机空间',
        userInfo:{
          uid:0
        }
      }
      ldb.db.set('currentSpace', currentSpace).write()
    }
    let space = {}
    if (currentSpace.spaceType === 'cloud') {
      let result = await spaceModel.setAdapter('cloud').getSpace(currentSpace.spaceId,currentSpace.userInfo)
      if (result.status === 1)
        space = result.data
    } else {
      space = await spaceModel.setAdapter(currentSpace.spaceType).getSpace(currentSpace.spaceId)
    }

    if (!space) {
      space = {
        name: '临时空间',
        id:1
      }
    }
    currentSpace.space = space
    ldb.db.set('currentSpace.name',space.name).write()
    return currentSpace
  },
  async getSpace (id,user) {
    return spaceModel.adapterModel.getSpace(id,user)
  },

  async addSpace (space) {
    return spaceModel.adapterModel.addSpace(space, spaceModel.user)
  },

  getCloudSpace (nanoid) {
    return {}
  },

  async changeCurrent (space) {
    //关闭mainWindow（自动会保存）
    let result =await spaceModel.adapterModel.changeCurrent(space, spaceModel.user)
    ipc.send('closeUserWindow')
    if(result.status)
    {
      return result.data
    }
    //设置数据库中的当前空间
  },
  async getLocalSpaces () {
    return localSpaceModel.getAll()
  },
  async deleteSpace(space){
   return await spaceModel.adapterModel.deleteSpace(space,spaceModel.user)
  },
  async importFromLocal(spaces){
    return await spaceModel.adapterModel.importFromLocal(spaces,spaceModel.user)
  },
  async renameSpace(newName,space){
    return await spaceModel.adapterModel.renameSpace(newName,space,spaceModel.user)
  },
  async getLastSyncSpace(){
    return await spaceModel.adapterModel.getLastSyncSpace()
  },
  async clientOffline(){
    return await spaceModel.adapterModel.clientOffline(spaceModel.user)
  },
  async clientOnline(nanoid){
    return await spaceModel.adapterModel.clientOnline(nanoid,spaceModel.user)
  }

}

module.exports = spaceModel
