const baseApi = require('../api/baseApi.js')
const userModel = require('../model/userModel')

const url = {
  add: '/app/addBarrage',
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

}


module.exports = BarrageApi
