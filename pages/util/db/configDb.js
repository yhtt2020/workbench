// const FileSync=require('lowdb/adapters/FileSync') //文件适配器
// const adapter=new FileSync(app.getPath('userData')+'configDb.json')//用户目录下的设置数据表
//版本号： 1.0.0
const low = eval('require')('lowdb')
const FileSync=eval('require')('lowdb/adapters/FileSync')
//以下是更新时需要覆盖的部分，其他部分保持不变。避免引入方法冲突



let dbInstance=null
let configDb = {
  dbInstance:null,
  userDataPath:'',
  storePath:'',
  init (userDataPath) {
    configDb.userDataPath= userDataPath
    const adapter=new FileSync(configDb.userDataPath + '/configDb.json')
    const db = low(adapter)
    configDb.dbInstance=db
    dbInstance=db
    dbInstance.defaults({
      config: {
        storePath: configDb.userDataPath+ '/收藏夹.lab'
      }
    }).write()
    configDb.storePath=dbInstance.get('config.storePath').value()

  },
  getStorePath(){
    return configDb.storePath
  },
  setStorePath(dir){
    dbInstance.set('config.storePath',dir).write()
  }
}
//以上是要复制的部分，其他部分不要复制

module.exports = configDb
