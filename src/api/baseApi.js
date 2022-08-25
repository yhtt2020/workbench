const axios = require('../util/axios.js')
const userModel = require('../model/userModel')
const baseApi = {
  token: '',
  currentUser: {},
  uid: 0,
  refreshToken: '',
  expireTime: 0,
  refreshExpireTime: 0,
  beforeInit: async() => {
    if(typeof window==='undefined'){
      baseApi.inMain = true
    }
  },
  init: async (user = false) => {
    await baseApi.beforeInit()
    if (user === false) {
      let userResponse = await userModel.getCurrent()
      if (userResponse.status === 1) {
        user = userResponse.data
      }
    }
    baseApi.currentUser = user
    baseApi.token = user.token
    baseApi.uid = user.uid
    baseApi.refreshToken = user.refresh_token
    baseApi.expireTime = user.expire_time
    baseApi.refreshExpireTime = user.refresh_expire_time
  },

  /**
   *
   * @param {String} url 请求url
   * @param {Object} params  请求体body或query对象, body中请传入类似data:{...}的格式，query中请传入{...}的格式。
   * @param {String} method  请求方式默认为post
   * @param {Boolean} min  是否为登录状态下发起的请求，默认是登录状态下
   * @returns Promise
   */
  axios: async (url, params, method = 'post', min = false) => {
    let data = {}
    if (method === 'get') data = { params }
    if (method === 'post' || method === 'put' || method === 'delete')
      data = { data: params }
    //todo cache请求缓存后期做一下，防止在1000毫秒内重复请求设置
    if (!min) {
      return axios({
        timeout: 5000,//设置默认3秒钟超时
        method: method,
        url: url,
        headers: { Authorization: baseApi.token },
        ...data,
        expireInfo: {
          token: baseApi.token,
          refreshToken: baseApi.refreshToken,
          expire_deadtime: baseApi.expireTime,
          refreshExpire_deadtime: baseApi.refreshExpireTime,
          inMain: baseApi.inMain
        }
      })
    } else {
      console.log(url)
      console.log(data)
      return axios({
        method: method,
        url: url,
        ...data,
      })
    }
  },
}
module.exports = baseApi
