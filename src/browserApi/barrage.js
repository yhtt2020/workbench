const {
  ipcRenderer
} = require('electron')
const ipc = ipcRenderer
const BarrageModel = require('../model/barrageModel')
const barrageModel=new BarrageModel()
const barrage={
  CONST:barrageModel.BARRAGE_CONST,
  urlChangedCallback:null,
  /**
   * init方法主要用于刷新api的信息，如果不init是不会重载里面的信息的
   * @returns {Promise<void>}
   */
  async init(){
    await barrageModel.init()
  },
  /**
   * 重载api，其实是和init一个原理，之所以单独命名只是为了符合语意
   * @returns {Promise<void>}
   */
  async reload(){
    await barrageModel.init()
  },
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
  /**
   * 锁定窗体
   */
  lock(){
    ipc.send('barrage.lock')
  }
}
module.exports=barrage
