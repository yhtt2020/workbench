const baseApi = require('./baseApi.js')

const url = {
  getUserInfo: '/app/getUserInfo',
}

const userApi = {
  async getUserInfo () {
    await baseApi.init()
    return baseApi.axios(url.getUserInfo, {fields:'fans,follow,grade,post_count,signature,nickname,avatar' },'get' )
  },
}
module.exports=userApi
