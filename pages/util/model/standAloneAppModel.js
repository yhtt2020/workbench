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
      app.settings=JSON.parse(app.settings)
    })
    return result
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
        themeColor: '#85ff85',
        userThemeColor: '',
        createTime: Date.now(),
        updateTime: Date.now(),
        accountAvatar: '',
        order: 0,
        useCount: 0,
        lastExecuteTime: Date.now(),
        settings: JSON.stringify(''),
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
            width:800,
            height:600
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
