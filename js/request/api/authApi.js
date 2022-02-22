const baseApi = require('./baseApi.js')

const url = {
  logoutBrowser: '/app/logoutBrowser',
  loginBrowser: '/app/loginBrowser',
  shareTasks: '/app/createTask',
  autoLogin: '/app/autoLogin',
  imAutoLogin: '/app/imAutoLogin',
  getUserInfo:'/app/getUserInfo'
}
const authApi = {
  async loginBrowser(info) {
    await baseApi.init()
    return baseApi.axios(url.loginBrowser, info)
  },
  async logoutBrowser (info) {
    await baseApi.init()
    return baseApi.axios(url.logoutBrowser, info)
  },
  async shareTasks(info) {
    await baseApi.init()
    const data = {
      uid: baseApi.uid === 0 ? null : baseApi.uid,
      site_list: info
    }
    return baseApi.axios(url.shareTasks, data)
  },
  async autoLogin() {
    await baseApi.init()
    const data = {
      client_id: require('../../../server-config').appConfig.client_id
    }
    return baseApi.axios(url.autoLogin, data)
  },
  async imAutoLogin() {
    await baseApi.init()
    const data = {
      client_id: require('../../../server-config').appConfig.client_id,
      bind_id: require('../../../server-config').appConfig.bind_im_id
    }
    return baseApi.axios(url.imAutoLogin, data)
  }
}
module.exports = authApi
