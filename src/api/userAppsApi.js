const baseApi = require('./baseApi.js')

const url = {
  navsList: '/app/browser/appUserList/list',
  addNav: '/app/browser/appUserList/card',
  delNav: '/app/browser/appUserList/delete',
  updateNav: '/app/browser/appUserList/update',

  appsList: '/app/browser/myApps/list',
  addApp: '/app/browser/myApps/card',
  deleteApp: '/app/browser/myApps/delete',
  updateApp: '/app/browser/myApps/update'
}
const userAppsApi = {
  //获取云导航列表
  async getAppUserNavs () {
    await baseApi.init()
    return baseApi.axios(url.navsList)
  },
  //card
  async addAppUserNav(info) {
    await baseApi.init()
    return baseApi.axios(url.addNav, info)
  },
  //delete
  async deleteAppUserNav(ids) {
    await baseApi.init()
    return baseApi.axios(url.delNav, ids)
  },
  //update
  async updateAppUserNav(info) {
    await baseApi.init()
    return baseApi.axios(url.updateNav, info)
  },


  //获取某一个导航下的apps
  async getUserNavApps(listId) {
    const data = {
      list_id: listId
    }
    await baseApi.init()
    return baseApi.axios(url.appsList, data)
  },
  //card
  async addUserNavApps(info) {
    await baseApi.init()
    return baseApi.axios(url.addApp, info)
  },
  //delete
  async delUserNavApps(ids) {
    await baseApi.init()
    return baseApi.axios(url.deleteApp, ids)
  },
  //update
  async updateUserNavApps(info) {
    await baseApi.init()
    return baseApi.axios(url.updateApp, info)
  }
}
module.exports = userAppsApi
