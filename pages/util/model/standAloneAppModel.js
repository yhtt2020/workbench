const db = require('../../../js/util/database.js').db
const serverConfig = require('../../../server-config.js').config
const standAloneAppModel = {
  async initialize () {
    await db.standAloneApps.count().then((result) => {
      if (result === 0) {
        standAloneAppModel.insertDefaultApps()
      }
    })
  },
  async getAllApps () {
    let result= await db.standAloneApps.toArray()
    result.forEach((app)=>{
      app.capture=''
      app.settings=JSON.parse(app.settings)
    })
    return result
  },
  async setAppSetting(id,settings){
    let app=await db.standAloneApps.get(id)
    if(!!!app){
      console.log('app不存在')
    }else{
      let DBSavedSettings=JSON.parse(app.settings)
      let newSettings=Object.assign(DBSavedSettings,settings)
      await db.standAloneApps.update(id,{"settings":JSON.stringify(newSettings)}).then((result)=>{
        console.log('save app settings success')
        return true
      }).catch((err)=>{
        console.log('存储app的setting失败')
      })
      console.log(newSettings)
    }
  },
  /**
   * 插入系统内置应用
   * @returns {Promise<*>}
   */
  async insertDefaultApps () {
    const defaultApps = [
      {
        name: '团队协作',
        logo: '../../icons/svg/chat.svg',
        summary: '团队协作，与团队成员高效协作',
        type: 'web',
        url: serverConfig.IM.FRONT_URL+ serverConfig.IM.AUTO_LOGIN,
        preload: '/pages/group/imPreload.js',
        themeColor: '#6fafff',
        userThemeColor: '',
        createTime: Date.now(),
        updateTime: Date.now(),
        accountAvatar: '',
        order: 0,
        useCount: 3,
        lastExecuteTime: Date.now(),
        settings: JSON.stringify({
          bounds:{
            width:800,
            height:600
          }
        }),
        unreadCount: 0,
        showInSideBar: true
      },
      {
        name: '效率社区',
        logo: '../../icons/svg/com.svg',
        summary: '效率社区，与全球高效能人士共同成长',
        type: 'web',
        url: serverConfig.SERVER_BASE_URL,
        preload:'/pages/com/preload.js',
        themeColor: '#85ff85',
        userThemeColor: '',
        createTime: Date.now(),
        updateTime: Date.now(),
        accountAvatar: '',
        order: 0,
        useCount: 0,
        lastExecuteTime: Date.now(),
        settings: JSON.stringify({
          bounds:{
            width:1100,
            height:800
          }
        }),
        unreadCount: 0,
        showInSideBar: true
      },
      {
        name: '收藏夹',
        logo: '../../icons/svg/apps.svg',
        summary: '收集你的灵感，集锦',
        preload: '/pages/apps/preload.js',
        type: 'local',
        package: 'com.thisky.group',
        url: '/pages/apps/index.html',
        themeColor: '#ecbfff9c',
        userThemeColor: '',
        createTime: Date.now(),
        updateTime: Date.now(),
        accountAvatar: '',
        order: 0,
        useCount: 0,
        lastExecuteTime: Date.now(),
        settings: JSON.stringify({
          bounds:{
            width:1200,
            height:800
          }
        }),
        unreadCount: 0,
        showInSideBar: true
      }
    ]
    return await db.standAloneApps.bulkAdd(defaultApps)
  }

}
module.exports = standAloneAppModel
