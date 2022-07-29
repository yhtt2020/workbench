const standReturn = require('../util/standReturn')
const { nanoid } = require('nanoid')
if (window) {
  ldb = window.ldb
}
const { SqlDb }=require('../util/sqldb')
let sqlDb=new SqlDb()
const localSpaceModel={
  /**
   * 获取空间，
   * @param id  nanoid，已更新sqldb
   * @returns {Promise<*|null>}
   */
  async getSpace(id){
    try{
      let space = await sqlDb.knex('local_space').where({ nanoid: id }).first()
      if (space) {
        return space
      } else {
        return null
      }
    }catch (e) {
      console.warn(e)
      return null
    }

  },
  /**
   * 获得最后同步的空间，已更新sqldb
   * @returns {null|*}
   */
  async getLastSyncSpace(){
    let space = await sqlDb.knex('local_space').orderBy('sync_time','desc').first()
    if(space){
      // if(!!!spaces[0].id){
      //   //ldb.db.get('spaces').remove({create_time:spaces[0]['create_time']}).write()
      //   return localSpaceModel.getLastSyncSpace()
      // }
      return space
    }else{
      return null
    }
  },

  /**
   * 复制空间，已更新为sqldb
   * @param space
   * @returns {Promise<{data: {}, status: number}|{data: *, status: number, info: string}>}
   */
  async copy(space){
    try{
      let sourceSpace=await sqlDb.knex('local_space').where({nanoid:space.nanoid}).first()
      if(!!!sourceSpace){
        return standReturn.failure('空间不存在')
      }
      let targetSpace= JSON.parse(JSON.stringify(sourceSpace))
      targetSpace.nanoid=nanoid()
      targetSpace.name=targetSpace.name+'_副本'
      targetSpace.update_time=Date.now()
      let result=await sqlDb.knex('local_space').insert(targetSpace)
      if(result.length>0){
        return standReturn.success(targetSpace)
      }
    }catch (e) {
      return standReturn.failure()
    }


  },
  /**
   * 添加空间，已更新为sqldb
   * @param space
   * @param user
   * @returns {Promise<{data: {}, status: number}|{data: *, status: number, info: string}>}
   */
  async addSpace(space,user){

    /*
     id:spaceId,
        data:saveData.data,
        name:'临时空间',
        count_task:saveData.count_task,
        count_tab:saveData.count_tab,
        create_time:Date.now(),
        update_time:Date.now(),
     */
    try{
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
        nanoid:nanoid()
      }
      let result=await sqlDb.knex('local_space').insert(spaceAdd)
      if(result.length>0){
        return standReturn.success(spaceAdd)
      }else{
        return standReturn.failure({},'插入失败。')
      }
    }catch (e) {
      return standReturn.failure({},'意外错误')
    }


  },

  /**
   * 获取用户的全部空间，已经更新为sqldb
   * @param user
   * @param option
   * @returns {Promise<{data: {}, status: number}|{data: *, status: number, info: *}>}
   */
  async getUserSpaces(user,option){
    try{
    let result=[]
      if(option.showBackup){
       let backupSpaces=await sqlDb.knex('backup_space').where({uid:user.uid}).orderBy('sync_time','desc','last')
        result= result.concat(backupSpaces)
      }
      let localSpaces=await sqlDb.knex('local_space').orderBy('sync_time','desc','last')
      result=result.concat(localSpaces)
      return  standReturn.success(result)
    }catch (e){
      console.warn(e)
     return  standReturn.failure([],'无法读取本地空间。')
    }
  },

  /**
   * 切换空间，已更新
   * @param space
   * @returns {Promise<{data: {}, status: number}>}
   */
  async changeCurrent(space){
    let currentSpace={spaceId:space.nanoid,spaceType:'local'}
    ipc.send('changeSpace',currentSpace)
    return standReturn.success(currentSpace)
  },

  /**
   * 获取全部空间，已更新为sqldb
   * @returns {Promise<*>}
   */
  async getAll(){
    return await sqlDb.knex('local_space').select()
  },

  /**
   * 删除空间，已更新为sqldb
   * @param space
   * @returns {Promise<{data: {}, status: number}|{data: *, status: number, info: string}>}
   */
  async deleteSpace(space){
    try{
      let result=await  sqlDb.knex('local_space').where({nanoid:space.nanoid}).delete()
      if(result.length>0){
        return standReturn.success()
      }
    }catch (e) {
      return standReturn.failure()
    }
  },

  /**
   * 重命名空间，已更新为sqldb
   * @param newName
   * @param space
   * @returns {Promise<{data: {}, status: number}|{data: *, status: number, info: string}>}
   */
  async renameSpace(newName,space){
    try{
      await sqlDb.knex('local_space').where({nanoid:space.nanoid}).update({
        name:newName,update_time:Date.now()
      })
      return standReturn.success()
    }catch (e) {
      return standReturn.failure()
    }


  },

  /**
   * 更新空间，已更新为sqldb
   * @param space
   * @returns {Promise<void>}
   */
  async update(space){
    let foundSpace= await sqlDb.knex('local_space').where({nanoid:space.nanoid}).value()
    if(foundSpace){
      let saveData={}
      saveData.update_time=Date.now()
      saveData.sync_time=Date.now()
      saveData.name=space.name
      saveData.type=space.type
      saveData.user=space.user
      sqlDb.knex('local_space').where({nanoid:space.nanoid}).update(saveData)
      standReturn.success('更新空间信息成功')
    }else{
     standReturn.failure('不存在空间。')
    }
  },

  /**
   * 存储空间，已更新为sqldb
   * @param space
   * @param saveData
   * @returns {Promise<{data: *, status: number, info: string}>}
   */
  async save(space,saveData){
    let foundSpace=await sqlDb.knex('local_space').where({nanoid:space.nanoid}).first()
    if(foundSpace){
      saveData.update_time=Date.now()
      saveData.sync_time=Date.now()
      saveData.data=JSON.stringify(saveData.data)
      await sqlDb.knex('local_space').where({nanoid:space.nanoid}).update(saveData)
    }else{
      if(!space.nanoid){
        throw Error('本地空间ID不存在')
      }
      return standReturn.failure('空间不存在')
      // let newSpace={
      //   nanoid:space.nanoid,
      //   data:saveData.data,
      //   name:space.name||'本机空间',
      //   count_task:saveData.count_task,
      //   count_tab:saveData.count_tab,
      //   create_time:Date.now(),
      //   update_time:Date.now(),
      //   sync_time:Date.now(),
      //   type:'local',
      //   uid:space.uid
      // }
      // ldb.db.get('spaces').push(newSpace).write()
    }
  }
}

module.exports = localSpaceModel
