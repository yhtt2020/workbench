const { pinyin } = require('pinyin-pro')
const db = require('../../js/util/database.js').db
const serverConfig = require('../../server-config.js').config
const tools = require('../util/util.js').tools
const { SqlDb } = require('../util/sqldb')
const { nanoid } = require('nanoid')
const sqlDb = new SqlDb()

async function initDb () {
  /**
   *  standAloneApps:'++id,name,package,logo,summary,type,url,theme_color,user_theme_color,create_time,updateTime,accountAvatar
   *  ,order,useCount,lastExecuteTime,settings,unreadCount,*fileAssign,auth,isNew,attribute',//新增两个字段方便应用市场查找筛选
   */
  sqlDb.knex.schema.hasTable('app').then(async function (exists) {
    if (!exists) {
      console.log('创建app表')
      await sqlDb.knex.schema.createTable('app', function (t) {
        t.string('nanoid').primary().unique() //本地id
        t.string('appid')//appstore的应用id
        t.string('name')
        t.string('author')
        t.string('package')
        t.string('preload')
        t.string('logo')
        t.string('summary')
        t.string('site')
        t.string('type')
        t.string('url')
        t.string('circle')
        t.string('theme_color')
        t.string('user_theme_color')
        t.integer('create_time')
        t.integer('update_time')
        t.string('account_avatar')
        t.integer('order')
        t.integer('use_count')
        t.integer('last_execute_time')
        t.string('settings')
        t.integer('unread_count')
        t.string('file_assign')
        t.string('auth')
        t.boolean('is_new')
        t.string('attribute')
      })
      //todo 迁移
      let saApps = await db.standAloneApps.orderBy('id').desc().toArray()
      //迁移数据库
      for (let i = 0; i < saApps.length; i++) {
        let item = saApps[i]
        let data = {
          nanoid: nanoid(8),
          appid: '',
          name: item.name,
          package: item.package,
          preload: item.preload,
          logo: item.logo,
          summary: item.summary,
          type: item.type || 'web',
          url: item.url,
          theme_color: item.themeColor,
          user_theme_color: item.userThemeColor || '',
          create_time: item.createTime,
          update_time: item.updateTime,
          account_avatar: item.accountAvatar,
          order: item.order || 0,
          use_count: item.useCount || 0,
          last_execute_time: item.lastExecuteTime,
          settings: item.settings,
          unread_count: item.unreadCount || 0,
          file_assign: item.fileAssign || [],
          auth: item.auth || [],
          is_new: item.isNew || 0,
          attribute: item.attribute || {}
        }
        await sqlDb.knex('app').insert(data)
      }
    }
  })

}

const systemAppPackage = [
  'com.thisky.group',
  'com.thisky.fav',
  'com.thisky.import',
  'com.thisky.helper',
  'com.thisky.imageEditor',
  'com.thisky.nav',
  'com.thisky.appStore',
  'com.thisky.com',
  'com.thisky.desk'
]  //包名为上述包名的判定为系统应用
const appModel = {

  async updateAppData (condition, newData) {
    let data = await sqlDb.knex('app').where(condition).first()//get({ name: '收藏夹' })
    if (data) {
      await sqlDb.knex('app').where({ nanoid: data.nanoid }).update(newData)
    }
  },

  /**
   * 确认应用信息，用于更新。
   * @returns {Promise<void>}
   */
  async ensureAppsData () {
    await appModel.updateAppData({ name: '收藏夹' }, {
      package: 'com.thisky.nav',
      url: '/pages/apps/index.html',
    })

    await appModel.updateAppData({ package: 'com.thisky.group' }, {
      name: '轻聊',
      logo: 'https://up.apps.vip/logo/group.png?t=2'
    })

    await appModel.updateAppData({ package: 'com.thisky.appStore' }, {
      name: '应用市场',
      logo: 'https://up.apps.vip/logo/favicon.svg',
      summary: '应用市场，助您发现更大的世界。',
      preload: '/pages/guide/preload.js',
      type: 'web',
      package: 'com.thisky.appStore',
      url: 'https://a.apps.vip/appStore/index.html',
      theme_color: '#3c78d8',
      user_theme_color: '',
      create_time: Date.now(),
      update_time: Date.now(),
      account_avatar: '',
      order: 0,
      use_count: 0,
      attribute: JSON.stringify({
        isOffical: 1,
        integration: 2
      }),
      last_execute_time: Date.now(),
      settings: JSON.stringify({
        bounds: {
          width: 1180,
          height: 864
        },
        showInSideBar: true
      }),
      unread_count: 0,
    })

    await appModel.updateAppData({ package: 'com.thisky.com' }, {
      package: 'com.thisky.com',
      'name': '元社区',
      'url': 'https://s.apps.vip',
      'logo': 'https://up.apps.vip/logo/yuan.png',
      theme_color: '#4188ff'
    })
  },

  /**
   * sqldb
   * @returns {Promise<void>}
   */
  async initialize () {
    await initDb()
    let count = await sqlDb.knex('app').count()
    if (!count) {
      await appModel.insertDefaultApps()
    }
    await appModel.ensureAppsData()

  },
  /**
   *sqldb
   * @param word
   * @param option
   * @returns {Promise<[]>}
   */
  async find (word, option) {
    let result = await sqlDb.knex('app').orderBy(option.order, 'desc').select()
    let searchResult = []

    const { pinyin } = require('pinyin-pro')

    function checkMatched (item) {
      return searchResult.some(v => v.name === item.name)
    }

    function dealItem (item) {
      if (item.hasOwnProperty('settings')) {
        item.settings = JSON.parse(item.settings)
      }
    }

    function matchChinese (str) {
      return str.match(/[\u4e00-\u9fa5]/g)
    }

    function intelligentMatch (arr, word) {
      if (word.length <= 1) return false
      if (!/^[\u4e00-\u9fa5_a-zA-Z]+$/.test(word)) return false
      let result = false
      let stop = false
      let wordArr = word.split('')

      function recur (targetArrParam, wordArrParam, targetIndexParam, wordArrIndexParam) {
        if (stop === false && wordArrParam.length <= targetArrParam.length && wordArrParam[wordArrIndexParam + 1]) {
          if (targetArrParam[targetIndexParam + 1] === wordArrParam[wordArrIndexParam + 1]) {
            result = true
          } else {
            result = false
            stop = true
          }
          recur(targetArrParam, wordArrParam, targetIndexParam + 1, wordArrIndexParam + 1)
        }
      }

      let arrIndex = 0
      let wordArrIndex = 0
      let needToRecur = false
      for (let i = 0; i < arr.length; i++) {
        if (needToRecur) break
        for (let j = 0; j < wordArr.length; j++) {
          if (needToRecur) break
          if (wordArr[j] === arr[i] && arr[i + 1]) {
            arrIndex = i
            wordArrIndex = j
            needToRecur = true
          }
        }
      }

      if (needToRecur) {
        recur(arr, wordArr, arrIndex, wordArrIndex)
      }
      return result
    }

    result.forEach(item => {
      if (matchChinese(item.name) && matchChinese(item.summary)) {
        let quanPinName = pinyin(matchChinese(item.name).join(''), { toneType: 'none', type: 'array' })   // 获取数组形式不带声调的拼音
        let firstPinName = pinyin(matchChinese(item.name).join(''), {
          pattern: 'first',
          toneType: 'none',
          type: 'array'
        })   // 获取数组形式不带音调拼音首字母
        let quanPinSummary = pinyin(matchChinese(item.summary).join(''), { toneType: 'none', type: 'array' })   // 获取数组形式不带声调的拼音
        let firstPinSummary = pinyin(matchChinese(item.summary).join(''), {
          pattern: 'first',
          toneType: 'none',
          type: 'array'
        })

        if ((item.name.toLowerCase().includes(word) || item.summary.includes(word) || tools.execDomain(item.url).toLowerCase().includes(word)) && !checkMatched(item)) {
          dealItem(item)
          searchResult.push(item)
        }

        quanPinName.forEach((v, index) => {
          if (v === word && !checkMatched(item)) {
            dealItem(item)
            searchResult.push(item)
          } else if (quanPinName.join('') === word && !checkMatched(item)) {
            dealItem(item)
            searchResult.push(item)
          } else if (index <= quanPinName.length - 2 && word.includes(v.concat(quanPinName[index + 1])) && !checkMatched(item)) {
            dealItem(item)
            searchResult.push(item)
          }
        })
        if (intelligentMatch(firstPinName, word) && !checkMatched(item)) {
          dealItem(item)
          searchResult.push(item)
        }

        quanPinSummary.forEach((v, index) => {
          if (v === word && !checkMatched(item)) {
            dealItem(item)
            searchResult.push(item)
          } else if (quanPinSummary.join('') === word && !checkMatched(item)) {
            dealItem(item)
            searchResult.push(item)
          } else if (index <= quanPinSummary.length - 2 && word.includes(v.concat(quanPinSummary[index + 1])) && !checkMatched(item)) {
            dealItem(item)
            searchResult.push(item)
          }
        })
        if (intelligentMatch(firstPinSummary, word) && !checkMatched(item)) {
          dealItem(item)
          searchResult.push(item)
        }
      }
    })

    return result.filter(v => v.name.includes(word) === true) || searchResult
  },
  /**
   * sqldb
   * @param id
   * @param data
   * @returns {Promise<*>}
   */
  async put (id, data) {
    data.settings = JSON.stringify(data.settings)
    return await sqlDb.knex('app').where({ nanoid: id }).update(data)
  },
  /**
   * sqldb 删除对象
   * @param appId
   * @returns {Promise<*|boolean>}
   */
  async uninstall (appId) {
    return await sqlDb.knex('app').where({ nanoid: appId }).delete()
  },
  /**
   * 从json安装应用
   * @param json
   * @returns {Promise<void>}
   */
  async installFromJson (json) {
    return await appModel.install(json.url, json)
  },

  async isInstalled (packageName) {
    let app = await appModel.getFromPackage(packageName)
    return !!app
  },

  /**
   * sqldb
   * @param url
   * @returns {Promise<boolean>}
   */
  async isInstalledByUrl (url) {
    return !!await sqlDb.knex('app').where({ 'url': url }).first()
  },
  /**
   * sqldb
   * 安装应用
   * @param url 安装的web应用地址
   * @param app 配置参数
   * @returns {Promise<void>}
   */
  async install (url = '', app = {}) {
    if (!!!url) return false
    let appInstall = {
      nanoid: app.nanoid ? app.nanoid : nanoid(8),
      name: app.name,
      logo: app.logo,
      summary: app.summary || '',
      type: app.type || 'web',
      author: app.author ? app.author : '',
      site: app.site ? app.site : '',
      url: url,
      circle: app.circle ? app.circle : '',
      // circleMessage: app.circleMessage ? app.circleMessage : '',
      preload: app.preload || '',
      package: app.package || '',
      theme_color: app.theme_color || '#ccc',
      user_theme_color: '',
      attribute: app.attribute,
      create_time: Date.now(),
      update_time: Date.now(),
      account_avatar: '',
      order: 0,
      use_count: 0,
      last_execute_time: Date.now(),
      settings: app.settings ? JSON.stringify(app.settings) : '[]',
      auth: app.auth ? JSON.stringify(app.auth) : '[]',
      unread_count: 0,
      is_new: true
    }
    let hasInstalled = false
    if (app.package) {
      hasInstalled = await appModel.isInstalled(app.package)
      if (!hasInstalled) {
        return false
      }
    }
    let insertResult=await sqlDb.knex('app').insert(appInstall)
    if(insertResult.length>0)
    return appInstall.nanoid
  },
  /**
   *sqldb
   * @param option  order,limit
   * @returns {Promise<*>}
   */
  async getAllApps (option = {}) {
    let result = []
    let query = sqlDb.knex('app')
    if (option.order) {
      query = query.orderBy(option.order, 'desc')
    }
    if (option.limit) {
      query = query.limit(option.limit)
    }
    result = await query.select()

    result.forEach((app) => {
      app.capture = ''
      app.isSystemApp = appModel.isSystemApp(app)
      try{
        app.attribute=app.attribute?JSON.parse(app.attribute):{}
      }catch (e) {
        app.attribute={}
      }

      app.settings = app.settings ? JSON.parse(app.settings) : {}
    })
    return result
  },
  /**
   * sqldb
   * @returns {Promise<boolean>}
   * @param nanoid
   */
  async get (map) {
    let data = false
    if(typeof map=='object'){
      data = await sqlDb.knex('app').where(map).first()
    }else{
      let nanoid=map
      data = await sqlDb.knex('app').where({ nanoid: nanoid }).first()
    }
    if (data) {
      data.settings = JSON.parse(data.settings)
      data.isSystemApp = appModel.isSystemApp(data)
    }
    return data
  },

  /**sqldb
   * @param packageName
   * @returns {Promise<*|boolean>}
   */
  async getFromPackage (packageName) {
    let app = await sqlDb.knex('app').where({ package: packageName }).first()
    if (!!!app) {
      return false
    }
    app.settings = JSON.parse(app.settings)
    app.isSystemApp = appModel.isSystemApp(app)
    return app
  },
  isSystemApp (app) {
    app.package = app.package || ''
    return systemAppPackage.indexOf(app.package) > -1
  },
  /**
   * sqldb
   * @param id
   * @param object
   * @returns {Promise<*>}
   */
  async update (id, object) {
    return await appModel.updateAppData({ nanoid: id }, object)
  },
  /**
   * sqldb,设置应用设置
   * @param id
   * @param settings
   * @returns {Promise<void>}
   */
  async setAppSetting (id, settings) {
    let app = await appModel.get(id)
    if (!!!app) {
      console.warn('app不存在')
      return false
    } else {
      let DBSavedSettings = app.settings
      let newSettings = Object.assign(DBSavedSettings, settings)
      await appModel.updateAppData({ nanoid: id }, { 'settings': JSON.stringify(newSettings) }).then((result) => {
        return true
      }).catch((err) => {
        console.warn('存储app的setting失败')
      })
    }
  },
  /**
   * sqldb
   * 插入系统内置应用
   * @returns {Promise<*>}
   */
  async insertDefaultApps () {
    const defaultApps = [
      {
        nanoid: nanoid(8),
        name: '轻聊',
        logo: 'https://up.apps.vip/logo/group.png?t=2',
        summary: '团队沟通，随时与团队成员实时沟通',
        type: 'web',
        //url: serverConfig.IM.FRONT_URL+ serverConfig.IM.AUTO_LOGIN,
        url: serverConfig.IM.FRONT_URL + serverConfig.IM.AUTO_LOGIN,
        preload: '/pages/group/imPreload.js',
        package: 'com.thisky.group',
        theme_color: '#6fafff',
        user_theme_color: '',
        create_time: Date.now(),
        update_time: Date.now(),
        account_avatar: '',
        order: 0,
        use_count: 3,
        attribute: {
          isOffical: 1,
          integration: 2
        },
        last_execute_time: Date.now(),
        settings: JSON.stringify({
          bounds: {
            width: 920,
            height: 720
          },
          autoRun: true,
          showInSideBar: true
        }),
        is_new: true,
        unread_count: 0,
      },
      {
        nanoid: nanoid(8),
        name: '元社区',
        logo: 'https://up.apps.vip/logo/yuan.png',
        package: 'com.thisky.com',
        summary: '用心经营您的元社区',
        type: 'web',
        url: serverConfig.SERVER_BASE_URL,
        preload: '/pages/com/preload.js',
        theme_color: '#85ff85',
        user_theme_color: '',
        create_time: Date.now(),
        update_time: Date.now(),
        account_avatar: '',
        order: 0,
        use_count: 0,
        attribute: {
          isOffical: 1,
          integration: 2
        },
        last_execute_time: Date.now(),
        settings: JSON.stringify({
          bounds: {
            width: 1200,
            height: 800
          },
          showInSideBar: true
        }),
        is_new: true,
        unread_count: 0,
      },
      {
        nanoid: nanoid(8),
        name: '超级收藏夹',
        logo: 'https://up.apps.vip/logo/fav.svg',
        summary: '整理你的超级资料库',
        preload: '/pages/fav/preload.js',
        type: 'web',
        package: 'com.thisky.fav',
        url: 'http://a.apps.vip/fav/',
        theme_color: '#3c78d8',
        user_theme_color: '',
        create_time: Date.now(),
        update_time: Date.now(),
        account_avatar: '',
        order: 0,
        use_count: 0,
        attribute: {
          isOffical: 1,
          integration: 2
        },
        last_execute_time: Date.now(),
        settings: JSON.stringify({
          bounds: {
            width: 1200,
            height: 800
          },
          showInSideBar: false,
        }),
        is_new: true,
        unread_count: 0,
      },
      {
        nanoid: nanoid(8),
        name: '导入助手',
        logo: 'https://up.apps.vip/logo/logo.svg',
        summary: '快速导入其他浏览器的书签、密码，设置为您的默认浏览器。',
        type: 'local',
        //url: serverConfig.IM.FRONT_URL+ serverConfig.IM.AUTO_LOGIN,
        url: '/pages/import/index.html',
        preload: '/pages/group/imPreload.js',
        package: 'com.thisky.import',
        theme_color: '#689aff',
        user_theme_color: '',
        create_time: Date.now(),
        update_time: Date.now(),
        account_avatar: '',
        order: 0,
        use_count: 0,
        attribute: {
          isOffical: 1,
          integration: 2
        },
        last_execute_time: Date.now(),
        settings: JSON.stringify({
          bounds: {
            width: 610,
            height: 500
          },
          showInSideBar: false
        }),
        is_new: true
      },
      {
        nanoid: nanoid(8),
        name: '图片编辑器',
        theme_color: 'rgb(90,170,60)',
        author: '想天软件',
        site: 'http://apps.vip',
        logo: 'https://a.apps.vip/imageEditor/icon.svg',
        url: 'https://a.apps.vip/imageEditor/',
        package: 'com.thisky.imageEditor',
        attribute: {
          isOffical: 1,
          integration: 2
        },
        create_time: Date.now(),
        update_time: Date.now(),
        summary: '可以为您的图片增加相框、贴纸、文字、进行简单裁减、旋转，还可以添加滤镜。',
        is_new: true,
        settings: '[]',
        file_assign: ['image']
      },
      {
        nanoid: nanoid(8),
        name: '帮助教程',
        logo: 'https://up.apps.vip/logo/help.png',
        url: 'https://www.yuque.com/tswork/ngd5zk/iuguin',
        package: 'com.thisky.helper',
        theme_color: '#ff7b42',
        attribute: {
          isOffical: 1,
          integration: 2
        },
        create_time: Date.now(),
        update_time: Date.now(),
        author: '想天软件',
        site: 'https://apps.vip/',
        checked: true,
        summary: '帮助手册，让你从零开始学会掌握想天浏览器。',
        is_new: true,
        settings: JSON.stringify({
          bounds: {
            width: 1200,
            height: 800
          },
          alwaysTop: false,
          showInSideBar: false,
        }),
      }
    ]
    await sqlDb.knex('app').insert(defaultApps)
    let appStoreData = require('../../pages/appStore/app.js')
    await appModel.installFromJson(appStoreData)
  },
  /**
   * 设置转中文表达
   * @param setting
   */
  settingToWords (setting) {
    //keepRunning', 'theme', 'desktop', 'showInSideBar', 'alwaysTop', 'autoRun'
    let words = ''
    switch (setting) {
      case 'bounds':
        words = '窗口大小'
        break
      case 'keepRunning':
        words = '保持运行'
        break
      case 'showInSideBar':
        words = '保持在左侧栏'
        break
      case 'alwaysTop':
        words = '窗口置顶'
        break
      case 'autoRun':
        words = '自动运行'
        break
      case 'disableWebSecurity':
        words = '本地权限'
        break
    }
    return words
  },
  authToWords (auth) {
    let words = ''
    switch (auth) {
      case 'webSecure':
        words = '跨域请求'
        break
      case 'setWallpaper':
        words = '设置壁纸'
        break
      case 'download':
        words = '下载文件'
        break
      case 'node':
        words = 'Node集成'
    }
    return words
  },
  /**
   * sqldb
   * @returns {Promise<*>}
   */
  async countApps () {
    return await sqlDb.knex('app').count()
  },
  /**
   * sqldb
   * @param fileType
   * @returns {Promise<*>}
   */
  async getFileAssginApps (fileType) {
    let assigned = await sqlDb.knex('app').where({ 'file_assign': fileType }).select()
    if (assigned) {
      assigned.forEach(item => {
        item.isSystemApp = appModel.isSystemApp(item)
      })
    }

    return assigned
  }

}
module.exports = appModel
