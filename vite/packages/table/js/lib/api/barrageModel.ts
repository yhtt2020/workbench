import {apiPost} from "../../axios/request";
const url = {
  add: '/app/addBarrage',
  list:'/app/getBarrageList',
  delete:'/app/deleteBarrage'
}
class BarrageModel {
   BARRAGE_CONST={
    CHANNEL:{
      PUBLIC:10001,
      GROUP:10002,
      TEAM:10003,
    }
  }
  constructor () {

  }


  /**
   * 发布弹幕
   * @param barrage
   * @returns {Promise<{data: {}, status: number}|{data: *, status: number, info: string}>}
   */
  async add (barrage: {}) {
     return await apiPost(url.add,barrage)
  }
  async delete(id: {}){
    return await apiPost(url.delete,id)
  }
  /**
   * 获取页面上的全部弹幕
   * @param channel
   * @param pageUrl
   * @returns {Promise<{data: {}, status: number}|{data: *, status: number, info: string}>}
   */
  async getList (channel: any, pageUrl: any): Promise<{ data: {}; status: number; } | { data: any; status: number; info: string; }> {
    return await apiPost(url.list,{
      channel,
      pageUrl
    })
  }
}

export default BarrageModel
