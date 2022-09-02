const baseApi = require('./baseApi.js')

const url = {
  userNavs: '/app/browser/appUserList/list',
  addUserApp: '/app/browser/myApps/add',

  groupList: '/app/browser/group/list',
  addGroupApp: '/app/browser/groupApps/add',
}
const navbarApi = {
  async getUserNavs () {
    await baseApi.init()
    return baseApi.axios(url.userNavs)
  },
  async addUserNavApp (info) {
    await baseApi.init()
    return baseApi.axios(url.addUserApp, info)
  },

  async getGroupList() {
    await baseApi.init()
    return baseApi.axios(url.groupList)
  },
  async addGroupNavApp(info) {
    await baseApi.init()
    return baseApi.axios(url.addGroupApp, info)
  }
}
module.exports = navbarApi
