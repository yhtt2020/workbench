 import BarrageModel from './barrageModel'
const barrageModel=new BarrageModel()
const barrage={
  CONST:barrageModel.BARRAGE_CONST,
  urlChangedCallback:null,
  sendBarrageCallback:null,


  /**
   * 发送弹幕api
   * @param data
   * @returns {Promise<{data: {}, status: number}|{data: *, status: number, info: string}>}
   */
  async add (data) {
    return await barrageModel.add(data)
  },
  /**
   * 获取弹幕列表
   * @param channel
   * @param pageUrl
   * @returns {Promise<{data: {}, status: number}|{data: *, status: number, info: string}>}
   */
  async getList(channel,pageUrl){
    return await barrageModel.getList(channel,pageUrl)
  },
  async delete(id){
    return await barrageModel.delete(id)
  },
  /**
   * url改变回调
   * @param callback
   */
  onUrlChanged(callback){
    barrage.urlChangedCallback=callback
  },

  onPostBarrage:(cb)=>{
    barrage.sendBarrageCallback=cb
  }//回调
}
export default barrage
