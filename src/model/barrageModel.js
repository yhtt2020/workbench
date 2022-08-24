const BarrageApi = require('../api/barrageApi')
const standReturn = require('../util/standReturn')

class BarrageModel {
  api
   BARRAGE_CONST={
    CHANNEL:{
      PUBLIC:10001,
      GROUP:10002
    }
  }
  constructor () {

  }

  async init () {
    this.api = new BarrageApi()
    this.api.init()
  }

  /**
   * 发布弹幕
   * @param barrage
   * @returns {Promise<{data: {}, status: number}|{data: *, status: number, info: string}>}
   */
  async add (barrage) {
    let rs = await this.api.add(barrage)
    if (rs.code === 1000) {
      return standReturn.success(barrage)
    } else {
      return standReturn.failure()
    }
  }

  /**
   * 获取页面上的全部弹幕
   * @param channel
   * @param pageUrl
   * @returns {Promise<{data: {}, status: number}|{data: *, status: number, info: string}>}
   */
  async getList (channel, pageUrl) {
    let rs = await this.api.list(channel,pageUrl)
    if (rs.code === 1000) {
      return standReturn.success(rs.data)
    } else {
      return standReturn.failure()
    }
  }
}

module.exports = BarrageModel
