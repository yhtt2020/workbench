const baseApi = require('./baseApi.js')

const url = {
  joinedCircle: '/app/browser/group/getJoinedCircle',
  managerCircle: '/app/browser/group/getMyCircle',
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
  //老团队接口
  async getGroups () {
    await baseApi.init()
    return baseApi.axios(url.groupList)
  },

  //获取我参与的圈子列表
  async getJoinedCircle(params) {
    await baseApi.init()
    return baseApi.axios(url.joinedCircle, params, 'get')
  },

  //获取我管理的圈子列表
  async getMyCircle(params) {
    await baseApi.init()
    return baseApi.axios(url.managerCircle, params, 'get')
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
