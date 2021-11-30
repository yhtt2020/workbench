const baseApi = require('./baseApi.js')

const url = {
  navsList: '/app/browser/appUserList/list',
  appsList: '/app/browser/myApps/list',
  addApp: '/app/browser/myApps/add',
  deleteApp: '/app/browser/myApps/delete'
}
const userAppsApi = {
  //获取云导航列表
  async getAppUserNavs () {
    await baseApi.init()
    return baseApi.axios(url.navsList)
  },
  //获取某一个导航下的apps
  async getUserNavApps(listId) {
    const data = {
      list_id: listId
    }
    await baseApi.init()
    return baseApi.axios(url.appsList, data)
  },
  //add
  async addUserNavApps(info) {
    await baseApi.init()
    return baseApi.axios(url.addApp, info)
  },
  //delete
  async delUserNavApps(ids) {
    await baseApi.init()
    return baseApi.axios(url.deleteApp, ids)
  }
}
module.exports = userAppsApi
