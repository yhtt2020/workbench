const {SqlDb}=require('../util/sqldb')
let sqlDb=new SqlDb()
const HIDE_EXTENSIONS='system.extension.hide' //隐藏的扩展
const DISABLE_EXTENSION='system.extension.disable' //禁用的扩展
const extensionModel={
  /**
   * 获取到隐藏的扩展设置
   * @returns {Promise<any>}
   */
  async getHideExts(){
    return await sqlDb.getConfig(HIDE_EXTENSIONS,[])
  },
  /**
   * 设置隐藏的扩展设置
   * @param value
   * @returns {Promise<void>}
   */
  async setHideExts(value){
    return await sqlDb.setConfig(HIDE_EXTENSIONS,value)
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
   * 移除某个插件的隐藏设置，防止数据库产生脏数据
   * @param baseName
   */
  async clearHide (baseName) {
    let hideExtensions =await extensionModel.getHideExts()
    if (hideExtensions.indexOf(baseName) > -1) {
      hideExtensions.splice(hideExtensions.indexOf(baseName), 1)
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
  },



  /**
   * 获取到隐藏的扩展设置
   * @returns {Promise<any>}
   */
  async getDisableExts(){
    return await sqlDb.getConfig(DISABLE_EXTENSION,[])
  },
  /**
   * 设置隐藏的扩展设置
   * @param value
   * @returns {Promise<void>}
   */
  async setDisableExts(value){
    return await sqlDb.setConfig(DISABLE_EXTENSION,value)
  },
  /**
   * 启用扩展
   * @param baseName 插件的路径名
   * @returns {Promise<void>}
   */
  async enableExt(baseName){
    let disableExtensions =await extensionModel.getDisableExts()
    if (disableExtensions.indexOf(baseName) > -1) {
      disableExtensions.splice(disableExtensions.indexOf(baseName), 1)
      await extensionModel.setDisableExts(disableExtensions)
    }
  },

  /**
   * 禁用扩展
   * @param baseName  路径名
   * @returns {Promise<void>}
   */
  async disableExt(baseName){
    let disableExtensions = await extensionModel.getDisableExts()
    await extensionModel.clearHide(baseName)//清理掉隐藏属性
    if (disableExtensions.length===0) {
      await extensionModel.setDisableExts( [baseName])
      return
    }
    if (disableExtensions.indexOf(baseName) === -1) {
      disableExtensions.push(baseName)
      await extensionModel.setDisableExts( disableExtensions)
    }
  }
}

module.exports=extensionModel
