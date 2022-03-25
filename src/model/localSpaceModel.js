const standReturn = require('../util/standReturn')
if (window) {
  ldb = window.ldb
}
const localSpaceModel={
  getSpace(id){
    ldb.reload()
    let space = ldb.db.get('spaces').find({ id: id }).value()
    if (space) {
      return space
    } else {
      return null
    }
  },

  addSpace(space,user){
    ldb.reload()
    /*
     id:spaceId,
        data:saveData.data,
        name:'临时空间',
        count_task:saveData.count_task,
        count_tab:saveData.count_tab,
        create_time:Date.now(),
        update_time:Date.now(),
     */
    let spaceAdd={
      name:space.name,
      data:[],
      count_task:0,
      count_tab:0,
      create_time:Date.now(),
      update_time:Date.now(),
      uid:0
    }
    ldb.db.get('spaces').push(spaceAdd).write()
    return standReturn.success(spaceAdd)
  },

  getUserSpaces(uid){
    ldb.reload()
    if(!uid){
      return  ldb.db.get('spaces').value()
    }
  }
}

module.exports = localSpaceModel
