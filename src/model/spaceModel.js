let ldb
const spaceModel = {
  getUserSpaces(uid){
    if (window) {
      ldb = window.ldb
    }
    if(uid===0){
      //本机
      return ldb.db.get('spaces').value()
    }
  },


  /**
   * 获取当前数据库
   */
  getCurrent () {
    if (window) {
      ldb = window.ldb
    }
    ldb.reload()
    let currentSpace = ldb.db.get('currentSpace').value()
    if (!currentSpace) {
      currentSpace = {
        spaceId: 1,
        spaceType: 'local'
      }
      ldb.db.set('currentSpace', currentSpace).write()
    }
    let space
    spaceModel.getSpace(currentSpace.spaceId, currentSpace.spaceType).then((result) => {
      space = result
    })
    if (!space) {
      space = {
        name: '临时空间'
      }
    }

    currentSpace.space = space
    return currentSpace
  },
  async getSpace (id, type = 'local') {
    if (type === 'local') {
      return new Promise((resolve) => {
        resolve(spaceModel.getLocalSpace(id))
      })
    } else {
      return await spaceModel.getCloudSpace(id)
    }
  },
  getCloudSpace (nanoid) {
    return {}
  },
  getLocalSpace (id) {
    ldb.reload()
    let space = ldb.db.get('spaces').find({ id: id }).value()
    if (space) {
      return space
    } else {
      return null
    }
  }
}

module.exports = spaceModel
