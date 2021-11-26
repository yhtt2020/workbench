const axios = require('../../../js/util/axios.js')
const { db } = require('../../../js/util/database')
const baseApi={
  token:"",
  currentUser:{},
  uid:0,
  getCurrentUser: ()=>{
     return db.system.where('name').equals('currentUser').first()
  },
  init: async()=>{
     await baseApi.getCurrentUser().then(user=>{
        baseApi.currentUser = user
        baseApi.token=user.value.token
        baseApi.uid=user.value.uid
      })
  },

  axios: async (url,data)=>{
    //todo 对未登录的场景进行判断
   return axios({
      method: 'post',
      url:url,
      headers: { Authorization: baseApi.token },
      data: data,
    })
  }
}
module.exports=baseApi
