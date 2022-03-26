
if (window) {
  ldb = window.ldb
}
const localSpaceModel=require('./localSpaceModel')

const spaceModel = {
  type: 'local',
  user: {
    uid: 0
  },
  adapterModel: require('./localSpaceModel'),
  setUser (user) {
    console.log(user)
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
      spaceModel.adapterModel = require('./clouldSpaceModel')
    }else{
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
    if (!currentSpace) {
      currentSpace = {
        spaceId: 1,
        spaceType: 'local'
      }
      ldb.db.set('currentSpace', currentSpace).write()
    }
    let space =await spaceModel.setAdapter(currentSpace.spaceType).getSpace(currentSpace.spaceId)
    if (!space) {
      space = {
        name: '临时空间'
      }
    }
    currentSpace.space = space
    return currentSpace
  },
  async getSpace (id) {
    return spaceModel.adapterModel.getSpace(id)
  },

  async addSpace (space) {
    return spaceModel.adapterModel.addSpace(space, spaceModel.user)
  },

  getCloudSpace (nanoid) {
    return {}
  },

  async changeCurrent(space){
    //关闭mainWindow（自动会保存）
    await spaceModel.adapterModel.changeCurrent(space)
    //设置数据库中的当前空间
  },
  async getLocalSpaces(){
    return localSpaceModel.getAll()
  }

}

module.exports = spaceModel
