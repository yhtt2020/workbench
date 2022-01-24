const db = require('../../../js/util/database.js').db
const serverConfig = require('../../../server-config.js').config
const standAloneAppModel = {
  async initialize() {
    await db.standAloneApps.count().then((result) => {
      if (result === 0) {
        standAloneAppModel.insertDefaultApps()
      }
    })

    await db.standAloneApps.where({id: 11}).count().then(result => {
      if (result === 0) {
        let wechatFile = {
          id: 11,
          name: '文件小助手',
          logo: '../../icons/apps/wechatfile.png',
          summary: '传输文件到微信，扫码即用',
          type: 'web',
          url: 'https://filehelper.weixin.qq.com/',
          preload: '',
          themeColor: '#07c160',
          userThemeColor: '',
          createTime: Date.now(),
          updateTime: Date.now(),
          accountAvatar: '',
          order: 0,
          useCount: 3,
          lastExecuteTime: Date.now(),
          settings: JSON.stringify({
            bounds: {
              width: 540,
              height: 540
            },
            alwaysTop: true,
            showInSideBar:true,
          }),
          unreadCount: 0,
          showInSideBar: true
        }
        db.standAloneApps.put(wechatFile)
      }
    })
  },
  async put(id,data){
    data.settings=JSON.stringify(data.settings)
    return await db.standAloneApps.put(id,data)
  },
  /**
   *删除对象
   * @param appId
   * @returns {Promise<*|boolean>}
   */
  async uninstall(appId){
    if(!appId) return false
    return await db.standAloneApps.delete(appId)
  },
  /**
   * 安装应用
   * @param url 安装的web应用地址
   * @param option 配置参数
   * @returns {Promise<void>}
   */
  async install(url = '', option = {}) {
    if (!!!url) return false
    let app = {
      name: option.name,
      logo: option.logo,
      summary: option.summary || '',
      type: option.type || 'web',
      url: url,
      preload: '',
      themeColor: option.themeColor || '#ccc',
      userThemeColor: '',
      createTime: Date.now(),
      updateTime: Date.now(),
      accountAvatar: '',
      order: 0,
      useCount: 0,
      lastExecuteTime: Date.now(),
      settings: JSON.stringify(option.settings),
      unreadCount: 0,
      showInSideBar: option.showInSideBar || false
    }
    return await db.standAloneApps.put(app)
  },
  async getAllApps() {
    let result = await db.standAloneApps.toArray()
    result.forEach((app) => {
      app.capture = ''
      app.settings = JSON.parse(app.settings)
    })
    return result
  },
  async get(id) {
    let data = false
    await db.standAloneApps.get(id).then((result) => {
      data = result
      data.settings=JSON.parse(data.settings)
    }, (err) => {
      data = false
    })
    return data
  },
  /**
   * 设置应用设置
   * @param id
   * @param settings
   * @returns {Promise<void>}
   */
  async setAppSetting(id, settings) {
    let app = await db.standAloneApps.get(id)
    if (!!!app) {
      console.log('app不存在')
    } else {
      let DBSavedSettings = JSON.parse(app.settings)
      let newSettings = Object.assign(DBSavedSettings, settings)
      await db.standAloneApps.update(id, {"settings": JSON.stringify(newSettings)}).then((result) => {
        console.log('save app settings success')
        return true
      }).catch((err) => {
        console.log('存储app的setting失败')
      })
      console.log(newSettings)
    }
  },
  /**
   * 插入系统内置应用
   * @returns {Promise<*>}
   */
  async insertDefaultApps() {
    const defaultApps = [
      {
        name: '团队协作',
        logo: '../../icons/svg/chat.svg',
        summary: '团队协作，与团队成员高效协作',
        type: 'web',
        //url: serverConfig.IM.FRONT_URL+ serverConfig.IM.AUTO_LOGIN,
        url: serverConfig.IM.FRONT_URL_DEV + serverConfig.IM.AUTO_LOGIN,
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
          bounds: {
            width: 800,
            height: 600
          },
          autoRun: true,
          showInSideBar:true
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
        preload: '/pages/com/preload.js',
        themeColor: '#85ff85',
        userThemeColor: '',
        createTime: Date.now(),
        updateTime: Date.now(),
        accountAvatar: '',
        order: 0,
        useCount: 0,
        lastExecuteTime: Date.now(),
        settings: JSON.stringify({
          bounds: {
            width: 1100,
            height: 800
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
          bounds: {
            width: 1200,
            height: 800
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
