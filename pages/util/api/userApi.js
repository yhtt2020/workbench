const baseApi = require('./baseApi.js')

const url = {
  getUserInfo: '/app/getUserInfo',
  addSpace:'/app/addSpace'
}

const userApi = {
  async getUserInfo () {
    await baseApi.init()
    return baseApi.axios(url.getUserInfo, {fields:'fans,follow,grade,post_count,signature,nickname,avatar' },'get' )
  },

  async addSpace(name,user=false){

    await baseApi.init(user)
    return baseApi.axios(url.addSpace,{name:name},'post')
  }
}


module.exports=userApi
