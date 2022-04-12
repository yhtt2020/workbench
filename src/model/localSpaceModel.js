const standReturn = require('../util/standReturn')
const { nanoid } = require('nanoid')
if (window) {
  ldb = window.ldb
}
const localSpaceModel={
  getSpace(id){
    ldb.reload()
    let space = ldb.db.get('spaces').find({ id: id }).value()
    if (space) {
      if(space.type==='cloud' && space.nanoid)
      {
        space.id=space.nanoid
      }
      return space
    } else {
      return null
    }
  },
  /**
   * 获得最后同步的空间
   * @returns {null|*}
   */
  getLastSyncSpace(){
    ldb.reload()
    let spaces = ldb.db.get('spaces').orderBy('sync_time','desc').value()
    if(spaces.length>0){
      // if(!!!spaces[0].id){
      //   //ldb.db.get('spaces').remove({create_time:spaces[0]['create_time']}).write()
      //   return localSpaceModel.getLastSyncSpace()
      // }
      return spaces[0]
    }else{
      return null
    }
  },
  copy(space){
    ldb.reload()
    let sourceSpace=localSpaceModel.getSpace(space.id)
    if(!!!sourceSpace){
      return standReturn.failure('空间不存在')
    }
    let targetSpace= JSON.parse(JSON.stringify(sourceSpace))
    targetSpace.id=nanoid()
    targetSpace.name=targetSpace.name+'_副本'
    targetSpace.update_time=Date.now()
    ldb.db.get('spaces').push(targetSpace).write()
    return standReturn.success(targetSpace)
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
        "saveTime": Date.now(),
      },
      count_task:1,
      count_tab:1,
      create_time:Date.now(),
      update_time:Date.now(),
      sync_time:Date.now(),
      uid:0,
      type:'local',
      id:nanoid()
    }
    ldb.db.get('spaces').push(spaceAdd).write()
    return standReturn.success(spaceAdd)
  },

  async getUserSpaces(user,option){
    ldb.reload()
    try{
      let spaces=[]
     spaces =  ldb.db.get('spaces').filter((sp)=>{
       return option.showBackup || sp.type==='local' || !sp.type
     }).orderBy('update_time','desc').value()
     return  standReturn.success(spaces)
    }catch (e){
     return  standReturn.failure([],'无法读取本地空间。')
    }


  },

  async changeCurrent(space){
    // ldb.reload()
    //
    // let currentSpace=ldb.db.get('currentSpace').value()
    // console.log(space)
    // ldb.db.set('currentSpace.spaceId',space.id).write()
    let currentSpace={spaceId:space.id,spaceType:'local'}
    ipc.send('changeSpace',currentSpace)
    return standReturn.success(currentSpace)
  },
  getAll(){
    ldb.reload()
    return ldb.db.get('spaces').value()
  },

  async deleteSpace(space){
    ldb.reload()
    ldb.db.get('spaces').remove({id:space.id}).write()
    return standReturn.success()
  },
  async renameSpace(newName,space){
    ldb.reload()
    ldb.db.get('spaces').find({id:space.id}).assign({name:newName,update_time:Date.now()}).write()
    return standReturn.success()
  },
  update(space){
    ldb.reload()
    let foundSpace= ldb.db.get('spaces').find({id:space.id}).value()
    if(foundSpace){
      let saveData={}
      saveData.update_time=Date.now()
      saveData.sync_time=Date.now()
      saveData.name=space.name
      saveData.type=space.type
      saveData.user=space.user
      ldb.db.get('spaces').find({id:space.id}).assign(saveData).write()
      standReturn.success('更新空间信息成功')
    }else{
     standReturn.failure('不存在空间。')
    }
  },
  save(space,saveData){
    ldb.reload()
    let foundSpace= ldb.db.get('spaces').find({id:space.id}).value()
    if(foundSpace){
      saveData.update_time=Date.now()
      saveData.sync_time=Date.now()
      ldb.db.get('spaces').find({id:space.id}).assign(saveData).write()
    }else{
      if(!space.id){
        throw Error('本地空间ID不存在')
      }
      let newSpace={
        id:space.id,
        data:saveData.data,
        name:space.name||'本机空间',
        count_task:saveData.count_task,
        count_tab:saveData.count_tab,
        create_time:Date.now(),
        update_time:Date.now(),
        sync_time:Date.now(),
        type:'local',
        uid:space.uid
      }
      ldb.db.get('spaces').push(newSpace).write()
    }
  }
}

module.exports = localSpaceModel
