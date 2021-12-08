const baseApi = require('./baseApi.js')

const url = {
  groupList: '/app/browser/group/list',
  navsList: '/app/browser/appGroupList/list'
}
const groupApi = {
  async getGroups () {
    await baseApi.init()
    return baseApi.axios(url.groupList)
  },

  /**
   * @param {Number} id 团队id
   */
  async getAppGroupNavs(id) {
    const data = {
      id: id
    }
    await baseApi.init()
    return baseApi.axios(url.navsList, data)
  }
}
module.exports = groupApi
