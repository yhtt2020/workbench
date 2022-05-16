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
    return baseApi.axios(url.loginBrowser, info, 'post', true)
  },
  async logoutBrowser () {
    await baseApi.init()
    return baseApi.axios(url.logoutBrowser)
  },
  async shareTasks(info) {
    await baseApi.init()
    if(baseApi.uid !== 0) {
      const data = {
        uid: baseApi.uid,
        site_list: info
      }
      return baseApi.axios(url.shareTasks, data)
    } else {
      const data = {
        uid: null,
        site_list: info
      }
      return baseApi.axios(url.shareTasks, data, 'post', true)
    }
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
