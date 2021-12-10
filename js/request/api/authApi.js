const baseApi = require('./baseApi.js')

const url = {
  logoutBrowser: '/app/logoutBrowser',
  loginBrowser: '/app/loginBrowser',
  shareTasks: '/app/createTask'
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
  }

}
module.exports = authApi
