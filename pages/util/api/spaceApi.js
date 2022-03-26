const baseApi = require('./baseApi.js')

const url = {
  getUserInfo: '/app/getUserInfo',
  addSpace:'/app/addSpace',
  spaceListMy:'/app/spaceListMy',
  change:'/app/changeSpace'
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
  async change(nanoid,user){
      await baseApi.init(user)
    return baseApi.axios(url.change,{nanoid:nanoid},'post')
  }
}


module.exports=spaceApi
