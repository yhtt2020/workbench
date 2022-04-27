const standReturn = require('../util/standReturn')
const spaceApi = require('../../pages/util/api/spaceApi')
const userModel = require('./userModel')
const { nanoid } = require('nanoid')
const backupSpaceModel = require('../model/backupSpaceModel')
const spaceModel = require('../model/spaceModel')
const cloudSpaceModel={
  async addSpace(space,user){
   let result= await spaceApi.addSpace(space.name,user)
   return standReturn.autoReturn(result)
  },
  /**
   * 修改当前的空间
   * @param space
   * @param user
   * @returns {Promise<{data: *, status: number}|{data: *, status: number, info: *}>}
   */
  async changeCurrent (space, user) {
    let result = await spaceApi.change(space.nanoid,user.clientId, user)
    if(result.code===1000){
      //切换当前用户到对应空间的所属用户
      await userModel.change(user)
      space.id=space.nanoid
      //获取最新的要切换过去的空间
      let cloudSpaceResult=await cloudSpaceModel.getSpace(space.id,user)
      if(cloudSpaceResult.status===1){
        let cloudSpace=cloudSpaceResult.data
        cloudSpace.id=cloudSpace.nanoid
        //正常登录需要使用线上版本的空间来更新一下本地的备份空间，此时是最佳的更新备份空间时机
        backupSpaceModel.save(cloudSpace,{name:cloudSpace.name,data:cloudSpace.data,count_task: cloudSpace.count_task,count_tab: cloudSpace.count_tab,userInfo:JSON.parse(JSON.stringify(user))})
        ipc.send('changeSpace',{spaceId:space.nanoid,spaceType:'cloud',name:cloudSpace.name,userInfo:JSON.parse(JSON.stringify(user))})
      }else{
        return standReturn.failure('空间异常')
      }

      return standReturn.autoReturn(result)
    }else{
      return standReturn.failure('重新连接失败')
    }

  },
  async getSpace(spaceId,userInfo){
    return await cloudSpaceModel.restore(spaceId, userInfo)
  },
  async getUserSpaces(user){
   let result= await spaceApi.getMySpaceList(user)
   return standReturn.autoReturn(result)
  },
  async save (spaceId, saveData, userInfo,force=false) {
    let result = await spaceApi.save(spaceId,userInfo.clientId, saveData,userInfo,force)
    return standReturn.autoReturn(result)
  },
  async copy(space,userInfo){
    let result = await spaceApi.copy(space.nanoid,userInfo)
    return standReturn.autoReturn(result)
  },
  async restore (spaceId, userInfo) {
    let result = await spaceApi.restore(spaceId,userInfo)
    return standReturn.autoReturn(result)
  },
  async deleteSpace(space,userInfo){
    let result = await spaceApi.delete(space.nanoid,userInfo)
    return standReturn.autoReturn(result)
  },
  /**
   * 导入本机空间到云端
   * @param spaces
   * @param userInfo
   * @returns {Promise<{data: {}, status: number}|{data: *, status: number, info: *}>}
   */
  async importFromLocal(spaces,userInfo){
    let result =await spaceApi.importFromLocal(spaces,userInfo)
    return standReturn.autoReturn(result)
  },
  async renameSpace(newName,space,userInfo){
    let result =await spaceApi.rename(newName,space.nanoid,userInfo)
    return standReturn.autoReturn(result)
  },
  async clientOffline(userInfo){
    let result =await spaceApi.clientOffline(userInfo.clientId,userInfo)
    return standReturn.autoReturn(result)
  },
  async clientOnline(nanoid,force=false,userInfo){
    let result =await spaceApi.clientOnline(nanoid,force,userInfo.clientId,userInfo)
    return standReturn.autoReturn(result)
  }
}

module.exports=cloudSpaceModel
