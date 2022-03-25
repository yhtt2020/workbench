const userApi = require('../../pages/util/api/userApi')
const standReturn = require('../util/standReturn')
const cloudSpaceModel={
  async addSpace(space,user){
   let result= await userApi.addSpace(space.name,user)
    if(result.code===1000){
      return standReturn.success(result.data)
    }else{
      return standReturn.failure(result.data)
    }
  }
}

module.exports=cloudSpaceModel
