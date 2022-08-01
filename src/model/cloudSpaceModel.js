const standReturn = require('../util/standReturn')
const spaceApi = require('../api/spaceApi')
const userModel = require('./userModel')
const { nanoid } = require('nanoid')
const backupSpaceModel = require('../model/backupSpaceModel')
const spaceModel = require('../model/spaceModel')
const cloudSpaceModel={
  userInfo: {},
  async addSpace(space,user){
   let result= await spaceApi.addSpace(space.name,user)
   return standReturn.autoReturn(result)
  },
  setUser(user){
    cloudSpaceModel.user=user
  },
  /**
   * 修改当前的空间
   * @param space
   * @param user
   * @returns {Promise<{data: *, status: number}|{data: *, status: number, info: *}>}
   */
  async changeCurrent (space) {
    let result = await spaceApi.change(space.nanoid,cloudSpaceModel.user.clientId, cloudSpaceModel.user)
    if(result.code===1000){
      //切换当前用户到对应空间的所属用户
      await userModel.change(cloudSpaceModel.user)
      space.id=space.nanoid
      //获取最新的要切换过去的空间
      let cloudSpaceResult=await cloudSpaceModel.getSpace(space.id,cloudSpaceModel.user)
      if(cloudSpaceResult.status===1){
        let cloudSpace=cloudSpaceResult.data
        cloudSpace.id=cloudSpace.nanoid
        cloudSpace.userInfo=cloudSpaceModel.user
        //正常登录需要使用线上版本的空间来更新一下本地的备份空间，此时是最佳的更新备份空间时机
        await backupSpaceModel.save(cloudSpace,{name:cloudSpace.name,data:cloudSpace.data,count_task: cloudSpace.count_task,count_tab: cloudSpace.count_tab})
        ipc.send('changeSpace',{spaceId:space.nanoid,spaceType:'cloud',name:cloudSpace.name,userInfo:JSON.parse(JSON.stringify(cloudSpaceModel.user))})
      }else{
        return standReturn.failure('空间异常')
      }

      return standReturn.autoReturn(result)
    }else{
      return standReturn.failure('重新连接失败')
    }

  },
  async getSpace(spaceId){
    return await cloudSpaceModel.restore(spaceId, cloudSpaceModel.user)
  },
  async getUserSpaces(){
   let result= await spaceApi.getMySpaceList(cloudSpaceModel.user)
   return standReturn.autoReturn(result)
  },
  async save (spaceId, saveData, userInfo,force=false) {
    console.log('测试用户数据',userInfo.clientId)
    let result = await spaceApi.save(spaceId,userInfo.clientId, saveData,userInfo,force)
    return standReturn.autoReturn(result)
  },
  async copy(space){
    let result = await spaceApi.copy(space.nanoid,cloudSpaceModel.user)
    return standReturn.autoReturn(result)
  },
  async restore (spaceId) {
    let result = await spaceApi.restore(spaceId,cloudSpaceModel.user)
    return standReturn.autoReturn(result)
  },
  async deleteSpace(space){
    let result = await spaceApi.delete(space.nanoid,cloudSpaceModel.user)
    return standReturn.autoReturn(result)
  },
  /**
   * 导入本机空间到云端
   * @param spaces
   * @param userInfo
   * @returns {Promise<{data: {}, status: number}|{data: *, status: number, info: *}>}
   */
  async importFromLocal(spaces){
    let result =await spaceApi.importFromLocal(spaces,cloudSpaceModel.user)
    return standReturn.autoReturn(result)
  },
  async renameSpace(newName,space){
    let result =await spaceApi.rename(newName,space.nanoid,cloudSpaceModel.user)
    return standReturn.autoReturn(result)
  },
  async clientOffline(){
    let result =await spaceApi.clientOffline(cloudSpaceModel.user.clientId,cloudSpaceModel.user)
    return standReturn.autoReturn(result)
  },
  async clientOnline(nanoid,force=false,userInfo){
    let result =await spaceApi.clientOnline(nanoid,force,cloudSpaceModel.user.clientId,cloudSpaceModel.user)
    return standReturn.autoReturn(result)
  }

}

module.exports=cloudSpaceModel
