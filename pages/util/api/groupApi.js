const baseApi = require('./baseApi.js')

const url = {
  list: '/app/browser/group/list'
}
const groupApi = {
  async getGroups () {
    await baseApi.init()
    const data = {
      uid: baseApi.uid
    }
    return  baseApi.axios(url.list, data)

  }
}
module.exports = groupApi
