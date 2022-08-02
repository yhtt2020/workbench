const {SqlDb}=require('../util/sqldb')
let sqlDb=new SqlDb()
const extensionModel={
  /**
   * 获取到隐藏的扩展设置
   * @returns {Promise<any>}
   */
  async getHideExts(){
    return await sqlDb.getConfig('hideExtensions',[])
  },
  /**
   * 设置隐藏的扩展设置
   * @param value
   * @returns {Promise<void>}
   */
  async setHideExts(value){
    return await sqlDb.setConfig('hideExtensions',value)
  },
  /**
   * 隐藏某个扩展
   * @param baseName 扩展路径名
   * @returns {Promise<void>}
   */
  async hideExt(baseName){
    let hideExtensions =await extensionModel.getHideExts()
    if (hideExtensions.length===0) {
      await extensionModel.setHideExts([baseName])
      return
    }
    if (hideExtensions.indexOf(baseName) === -1) {
      hideExtensions.push(baseName)
      await extensionModel.setHideExts(hideExtensions)
    }
  },
  /**
   * 显示某个扩展
   * @param baseName 扩展路径名
   * @returns {Promise<void>}
   */
  async showExt(baseName){
    let hideExtensions =await extensionModel.getHideExts()
    if (hideExtensions.indexOf(baseName) > -1) {
      hideExtensions.splice(hideExtensions.indexOf(baseName), 1)
      await extensionModel.setHideExts(hideExtensions)
    }
  }
}

module.exports=extensionModel
