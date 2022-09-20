const baseApi = require('./baseApi.js')

const url = {
  getUserInfo: '/app/getUserInfo',
  addSpace:'/app/addSpace',
  spaceListMy:'/app/spaceListMy',
  refreshToken: '/app/refreshBrowserToken'
}

const userApi = {
  async getUserInfo () {
    await baseApi.init()
    return baseApi.axios(url.getUserInfo, {fields:'fans,follow,grade,post_count,signature,nickname,avatar' },'get' )
  },
  async refreshToken(user){
    await baseApi.init(user)
    let res=await baseApi.axios(url.refreshToken, {
      refreshToken:user.refresh_token
    },'post')
    if(res.code === 1000) {
      //续期成功
      return res.data
    } else {
      return false
    }
  }
}


module.exports=userApi
