const baseApi = require('./baseApi.js')

const url = {
  logoutBrowser: '/app/logoutBrowser',
  loginBrowser: '/app/loginBrowser'
}
const authApi = {
  async loginBrowser(info) {
    await baseApi.init()
    return baseApi.axios(url.loginBrowser, info)
  },
  async logoutBrowser (info) {
    await baseApi.init()
    return baseApi.axios(url.logoutBrowser, info)
  }

}
module.exports = authApi
