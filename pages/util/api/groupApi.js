const baseApi = require('./baseApi.js')

const url = {
  groupList: '/app/browser/group/list',
  navsList: '/app/browser/appGroupList/list',
  addNav: '/app/browser/appGroupList/add',
  updateNav: '/app/browser/appGroupList/update',


  appsList: '/app/browser/groupApps/list',
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


  async getGroupNavApps(listId) {
    const data = {
      list_id: listId
    }
    await baseApi.init()
    return baseApi.axios(url.appsList, data)
  }


}
module.exports = groupApi
