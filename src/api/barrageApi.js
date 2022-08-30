const baseApi = require('../api/baseApi.js')
const userModel = require('../model/userModel')

const url = {
  add: '/app/addBarrage',
  list:'/app/getBarrageList'
}

class BarrageApi {
    baseApi
   constructor (props) {

  }

  async init () {
    await baseApi.init()
  }
  async add(data){
    return await baseApi.axios(url.add, data, 'post')
  }

  /**
   * 获取某个页面的全部弹幕
   * @param channel
   * @param pageUrl
   * @returns {Promise<*>}
   */
  async list(channel,pageUrl){
      return await baseApi.axios(url.list,{
        channel:channel,
        pageUrl:pageUrl
      })
  }

}


module.exports = BarrageApi
