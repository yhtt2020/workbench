const baseApi = require('./baseApi.js')

const url = {
  groupList: '/app/browser/group/list',
  navsList: '/app/browser/appGroupList/list',
  addNav: '/app/browser/appGroupList/add',
  updateNav: '/app/browser/appGroupList/update',
  delNav: '/app/browser/appGroupList/delete',

  appsList: '/app/browser/groupApps/list',
  addApp: '/app/browser/groupApps/add',
  deleteApp: '/app/browser/groupApps/delete',
  updateApp: '/app/browser/groupApps/update'
}
const groupApi = {
  async getGroups () {
    await baseApi.init()
    return baseApi.axios(url.groupList)
  },

  /**
   * 获取团队id下的云端团队导航列表
   * @param {Number} id 团队id
   */
  async getAppGroupNavs(id) {
    const data = {
      id: id
    }
    await baseApi.init()
    return baseApi.axios(url.navsList, data)
  },

  //团队id下云端团队导航列表add
  async addAppGroupNav(info) {
    await baseApi.init()
    return baseApi.axios(url.addNav, info)
  },

  //update
  async updateAppGroupNav(info) {
    await baseApi.init()
    return baseApi.axios(url.updateNav, info)
  },
  //delete
  async deleteAppGroupNav(info) {
    await baseApi.init()
    return baseApi.axios(url.delNav, info)
  },


  async getGroupNavApps(listId) {
    const data = {
      list_id: listId
    }
    await baseApi.init()
    return baseApi.axios(url.appsList, data)
  },
  //add
  async addGroupNavApps(info) {
    await baseApi.init()
    return baseApi.axios(url.addApp, info)
  },
  //delete
  async delGroupNavApps(info) {
    await baseApi.init()
    return baseApi.axios(url.deleteApp, info)
  },
  //update
  async updateGroupNavApps(info) {
    await baseApi.init()
    return baseApi.axios(url.updateApp, info)
  }


}
module.exports = groupApi
