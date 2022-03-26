const userApi = require('../../pages/util/api/userApi')
const standReturn = require('../util/standReturn')
const spaceApi = require('../../pages/util/api/spaceApi')
const cloudSpaceModel={
  async addSpace(space,user){
   let result= await spaceApi.addSpace(space.name,user)
   return standReturn.autoReturn(result)
  },
  async changeCurrent (space, user) {
    let result = await spaceApi.change(space.uuid, user)
    return standReturn.autoReturn(result)
    // ldb.reload()
    //
    // let currentSpace=ldb.db.get('currentSpace').value()
    // console.log(space)
    // ldb.db.set('currentSpace.spaceId',space.id).write()
    //ipc.send('changeSpace',{spaceId:space.nanoid,spaceType:'cloud'})

  },
  async getUserSpaces(user){
   let result= await spaceApi.getMySpaceList(user)
   return standReturn.autoReturn(result)
  }
}

module.exports=cloudSpaceModel
