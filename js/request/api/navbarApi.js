const baseApi = require('./baseApi.js')

const url = {
  userNavs: '/app/browser/appUserList/list',
}
const navbarApi = {
  async getUserNavs () {
    await baseApi.init()
    return baseApi.axios(url.userNavs)
  }
}
module.exports = navbarApi
