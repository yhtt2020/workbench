const userApi = require('../../pages/util/api/userApi')
const standReturn = require('../util/standReturn')
const spaceApi = require('../../pages/util/api/spaceApi')
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
    return standReturn.autoReturn(result)
    //ipc.send('changeSpace',{spaceId:space.nanoid,spaceType:'cloud'})

  },
  async getUserSpaces(user){
   let result= await spaceApi.getMySpaceList(user)
   return standReturn.autoReturn(result)
  }
}

module.exports=cloudSpaceModel
