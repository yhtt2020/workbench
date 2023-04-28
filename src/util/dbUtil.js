const path = require('path')
const { app } = require('electron')
const dbUtil={
  /**
   * 根据当前的环境判断，自动获取到一个db的路径，目前仅支持在userdata/db目录下创建db，统一管理
   * @param dbName
   * @returns {string}
   */
  getDbPath(dbName){
    let filename
    if (typeof window !=='undefined') {
      window=require('../util/util').tools.getWindowArgs(window)
      filename = window.globalArgs['user-data-path'] + '/db/'+dbName+'.sqlite'
    } else {
      const isDevelopmentMode = process.argv.some(arg => arg === '--development-mode')
      if (isDevelopmentMode && app.getPath('userData').indexOf('-development')===-1) {
        //是调试模式，且还未添加development
        filename = path.join(app.getPath('userData') + '-development', 'db/'+dbName+'.sqlite')
      }else{
        filename = path.join(app.getPath('userData'), 'db/'+dbName+'.sqlite')
      }
    }
    console.log('得到数据库名称',filename)
    return filename
  }
}

module.exports=dbUtil
