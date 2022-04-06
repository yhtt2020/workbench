const standReturn = require('../util/standReturn')
const spaceApi = require('../../pages/util/api/spaceApi')
const userModel = require('./userModel')
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
    await userModel.change(user)
    ipc.send('changeSpace',{spaceId:space.nanoid,spaceType:'cloud',userInfo:JSON.parse(JSON.stringify(user))})
    return standReturn.autoReturn(result)
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
