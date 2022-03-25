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
      data:{
        "version": 2,
        "state": {
          "tasks": [
          ],
          "selectedTask": ""
        },
        "saveTime": Date.now()
      },
      count_task:1,
      count_tab:1,
      create_time:Date.now(),
      update_time:Date.now(),
      uid:0,
      id:Date.now()
    }
    ldb.db.get('spaces').push(spaceAdd).write()
    return standReturn.success(spaceAdd)
  },

  getUserSpaces(uid){
    ldb.reload()
    if(!uid){
      return  ldb.db.get('spaces').value()
    }
  },

  changeCurrent(space){
    ldb.reload()
    let currentSpace=ldb.db.get('currentSpace').value()
    console.log(space)
    ldb.db.set('currentSpace.spaceId',space.id).write()
  },
  getAll(){
    ldb.reload()
    return ldb.db.get('spaces').value()
  }
}

module.exports = localSpaceModel
