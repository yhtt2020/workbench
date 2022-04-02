const baseApi = require('./baseApi.js')

const url = {
  getUserInfo: '/app/getUserInfo',
  addSpace:'/app/addSpace',
  spaceListMy:'/app/spaceListMy',
  change:'/app/changeSpace',
  save:'/app/saveSpace',
  restore:'/app/getSpace',
  delete:'/app/deleteSpace',
  import:'/app/importSpaces',
  rename:'/app/renameSpace',
  clientOffline:'/app/clientOffline',
  clientOnline:'/app/clientOnline'
}

const spaceApi = {
    async addSpace(name,user=false){
    await baseApi.init(user)
    return baseApi.axios(url.addSpace,{name:name},'post')
  },
  async getMySpaceList(user=false){
    await baseApi.init(user)
    return baseApi.axios(url.spaceListMy,{},'get')
  },
  async change(nanoid,clientId,user){
    await baseApi.init(user)
    return baseApi.axios(url.change,{nanoid:nanoid,clientId:clientId,force:true},'post')
  },
  async save(nanoid,clientId, saveData,user,force=false){
    await baseApi.init(user)
    return baseApi.axios(url.save,{nanoid,clientId,saveData,force},'post')
  },
  async restore(nanoid,user){
    await baseApi.init(user)
    return baseApi.axios(url.restore,{nanoid:nanoid},'post')
  },
  async delete(nanoid,user){
    await baseApi.init(user)
    return baseApi.axios(url.delete,{nanoid:nanoid},'post')
  },
  async importFromLocal(spaces,user){
    await baseApi.init(user)
    return baseApi.axios(url.import,{spaces:spaces},'post')
  },
  async rename(newName,nanoid,user){
    await baseApi.init(user)
    return baseApi.axios(url.rename,{newName:newName,nanoid:nanoid},'post')
  },
  async clientOffline(clientId,user){
    await baseApi.init(user)
    return baseApi.axios(url.clientOffline,{clientId:clientId},'post')
  },
  async clientOnline(nanoid,clientId,user){
    await baseApi.init(user)
    return baseApi.axios(url.clientOnline,{nanoid,clientId:clientId},'post')
  }
}


module.exports=spaceApi
