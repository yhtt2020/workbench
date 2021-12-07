const baseApi = require('./baseApi.js')

const url = {
  list: '/app/browser/group/list'
}
const groupApi = {
  async getGroups () {
    await baseApi.init()
    return baseApi.axios(url.list)
  }
}
module.exports = groupApi
