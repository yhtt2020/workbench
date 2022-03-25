let ldb
const spaceModel = {
  /**
   * 获取当前数据库
   */
  getCurrent () {
    if(window){
      ldb=window.ldb
    }
    let currentSpace = ldb.db.get('currentSpace').value()
    if (!currentSpace) {
      currentSpace = {
        spaceId: 1,
        spaceType: 'local'
      }
      ldb.db.set('currentSpace', currentSpace).write()
    }
    return currentSpace
  }
}

module.exports=spaceModel
