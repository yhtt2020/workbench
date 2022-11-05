const { pinyin } = require('pinyin-pro')
const db = require('../../js/util/database.js').db
const serverConfig = require('../../server-config.js').config
const tools = require('../util/util.js').tools
const { SqlDb } = require('../util/sqldb')
const { nanoid } = require('nanoid')
const sqlDb = new SqlDb()



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
  async initDb () {
    /**
     *  standAloneApps:'++id,name,package,logo,summary,type,url,theme_color,user_theme_color,create_time,updateTime,accountAvatar
     *  ,order,useCount,lastExecuteTime,settings,unreadCount,*fileAssign,auth,isNew,attribute',//新增两个字段方便应用市场查找筛选
     */
    let exists = await sqlDb.knex.schema.hasTable('app')
    if (!exists) {
      console.log('检测到app表不存在，自动创建')
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


        //新补充的字段
        t.string('window').comment('窗体设置')
        t.boolean('open_source').comment('是否开源')
        t.string('csv_url').comment('开源代码地址')
        t.string('os_summary').comment('开源说明')

        t.boolean('is_debug').comment('是否是调试应用')
      })
      await this.migrateDB()
      //todo 迁移
    }else{
      //防止迁移失败导致未成功转入应用
      await this.migrateDB()
    }
  },
async ensureColumns(){
  console.log('检测数据库版本')
  // await sqlDb.knex.schema.table('app', function (t) {
  //   t.boolean('is_debug').comment('是否是调试应用')
  // })
  if(!await sqlDb.knex.schema.hasColumn('app','window')){
    //确认版本
    console.log('升级数据库')
    await sqlDb.knex.schema.table('app', function (t) {
      console.log('开始添加字段')
      t.string('window').comment('窗体设置')
      t.boolean('open_source').comment('是否开源')
      t.string('csv_url').comment('开源代码地址')
      t.string('os_summary').comment('开源说明')
      t.boolean('is_debug').comment('是否是调试应用')
    })
  }
},
  async migrateDB(){
    console.log('迁移数据库')
    const DONE='app.migrate.done'
    if(await sqlDb.getConfig(DONE)){
      await this.ensureColumns()
      return
    }
    let count = await sqlDb.knex('app').count({count: '*'})
    let appsCount=count[0].count
    if(appsCount){
      await sqlDb.setConfig(DONE,true)
      //已经迁移过了，直接跳过，防止重复迁移
      return
    }
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
        settings: item.settings||{},
        unread_count: item.unreadCount || 0,
        file_assign: item.fileAssign || [],
        auth: item.auth || [],
        is_new: item.isNew || 0,
        attribute: item.attribute || {}
      }
      await sqlDb.knex('app').insert(data)
      console.log('迁移应用',data)
    }
    if(saApps.length===0){
      console.log('准备插入默认应用')
      await appModel.insertDefaultApps()
    }
    await sqlDb.setConfig(DONE,true)
  },
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
    await appModel.initDb()

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
      let match=str.match(/[\u4e00-\u9fa5]/g)
      if(match)
        return match
      else{
        return []
      }
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

    function isOrderMatch(target,find){
      for (let i=0;i<find.length;i++){
        //挨个字符去匹配，一旦找到，就从这个字符开始的位置继续匹配，如果全部匹配到，则认为成功
        let currentChart=find.charAt(i)
        let charIndex=target.indexOf(currentChart)
        if(charIndex===-1){
          //没找到这个字符
          return false
        }
        //如果找到位置，则截断当前的字符后，继续往后面找
        target=target.substring(charIndex)
      }
      //找了一遍都找到了，则返回true
      return true
    }
    function testPin(target,find){
      function split(str){
        let arr=[]
        for (let i=0;i<str.length;i++){
          arr.push(str.charAt(i))
        }
        return arr
      }


      find=find.toLowerCase()
      let full=pinyin(target.toLowerCase(), { toneType: 'none', type: 'array' })
      let first=pinyin(target.toLowerCase(), {
        pattern: 'first',
        toneType: 'none',
        type: 'array'
      })
      let fullStr=full.join('')
      let firstStr=first.join('')
      if(isOrderMatch(fullStr,find)|| isOrderMatch(firstStr,find))
      {
        return true
      }
    }

    let matchedApps= result.filter(app=>{
      if(testPin(app.name,word) || testPin(app.summary,word) || testPin(app.url,word) || isOrderMatch(app.name,word) || isOrderMatch(app.summary,word)){
        return true
      }
    })
    return matchedApps

    //
    // result.forEach(item => {
    //   try{
    //     let haveChinese=matchChinese(item.name) || matchChinese(item.summary)
    //     if (haveChinese) {
    //       let quanPinName = pinyin(matchChinese(item.name).join(''), { toneType: 'none', type: 'array' })   // 获取数组形式不带声调的拼音
    //       let firstPinName = pinyin(matchChinese(item.name).join(''), {
    //         pattern: 'first',
    //         toneType: 'none',
    //         type: 'array'
    //       })   // 获取数组形式不带音调拼音首字母
    //
    //
    //       console.log('quanPinName',quanPinName)
    //       console.log('firstPinName',firstPinName)
    //       let quanPinSummary = pinyin(matchChinese(item.summary).join(''), { toneType: 'none', type: 'array' })   // 获取数组形式不带声调的拼音
    //       let firstPinSummary = pinyin(matchChinese(item.summary).join(''), {
    //         pattern: 'first',
    //         toneType: 'none',
    //         type: 'array'
    //       })
    //       console.log('quanPinSummary',quanPinSummary)
    //       console.log('firstPinSummary',firstPinSummary)
    //       if ((item.name.toLowerCase().includes(word) || item.summary.includes(word) || tools.execDomain(item.url).toLowerCase().includes(word)) && !checkMatched(item)) {
    //         dealItem(item)
    //         console.log('匹配1')
    //         searchResult.push(item)
    //       }
    //
    //       quanPinName.forEach((v, index) => {
    //         if (v === word && !checkMatched(item)) {
    //           console.log('匹配2')
    //           dealItem(item)
    //           searchResult.push(item)
    //         } else if (quanPinName.join('') === word && !checkMatched(item)) {
    //           console.log('匹配3')
    //           dealItem(item)
    //           searchResult.push(item)
    //         } else if (index <= quanPinName.length - 2 && word.includes(v.concat(quanPinName[index + 1])) && !checkMatched(item)) {
    //           console.log('匹配4')
    //           dealItem(item)
    //           searchResult.push(item)
    //         }
    //       })
    //       if (intelligentMatch(firstPinName, word) && !checkMatched(item)) {
    //         console.log('匹配5')
    //         dealItem(item)
    //         searchResult.push(item)
    //       }
    //
    //       quanPinSummary.forEach((v, index) => {
    //         if (v === word && !checkMatched(item)) {
    //           dealItem(item)
    //           searchResult.push(item)
    //         } else if (quanPinSummary.join('') === word && !checkMatched(item)) {
    //           dealItem(item)
    //           searchResult.push(item)
    //         } else if (index <= quanPinSummary.length - 2 && word.includes(v.concat(quanPinSummary[index + 1])) && !checkMatched(item)) {
    //           dealItem(item)
    //           searchResult.push(item)
    //         }
    //       })
    //       if (intelligentMatch(firstPinSummary, word) && !checkMatched(item)) {
    //         dealItem(item)
    //         searchResult.push(item)
    //       }
    //     }
    //   }catch (e) {
    //     console.warn(e)
    //     console.warn(item)
    //   }
    //
    //
    // })
    //
    // return result.filter(v => v.name.includes(word) === true) || searchResult
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

  /**
   * 从json安装应用
   * @param json
   * @returns {Promise<void>}
   */
  async installDebugAppFromJson (json) {
    delete json.nanoid
    if(json.use_debug_url){
      if(json.debug_url.startsWith('http'))
      {
        json.type='local'
      }
      json.url=json.debug_url
    }
    json.is_debug=true

    console.log(json)
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

    if(app.themeColor){
      app.theme_color=app.themeColor
    }


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

      window:JSON.stringify(app.window || {}),
      open_source:app.open_source,
      csv_url:app.csv_url,
      os_summary:app.os_summary,
      is_debug:app.is_debug,


      account_avatar: '',
      order: 0,
      use_count: 0,
      last_execute_time: Date.now(),
      settings: app.settings ? JSON.stringify(app.settings) : JSON.stringify({}),
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
    let insertResult = await sqlDb.knex('app').insert(appInstall)
    if (insertResult.length > 0)
      return appInstall.nanoid
  },
  /**
   * 获得全部自启动的应用
   * @returns {Promise<*[]>}
   */
  async getAutoRunApps(){
   let allApps=await  appModel.getAllApps()
    return allApps.filter((app)=>{
      return !!app.settings.autoRun;
    })
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
      try {
        app.attribute = app.attribute ? JSON.parse(app.attribute) : {}
      } catch (e) {
        app.attribute = {}
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
    if (typeof map == 'object') {
      data = await sqlDb.knex('app').where(map).first()
    } else {
      let nanoid = map
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
      if(Array.isArray(DBSavedSettings)){
        DBSavedSettings={} //默认值有误
      }
      let newSettings = Object.assign(DBSavedSettings, settings)
      await appModel.updateAppData({ nanoid: id }, { 'settings': JSON.stringify(newSettings) }).then((result) => {
        return true
      }).catch((err) => {
        console.warn('存储app的setting失败',err)
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
        attribute: JSON.stringify({
          isOffical: 1,
          integration: 2
        }),
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
        attribute:JSON.stringify( {
          isOffical: 1,
          integration: 2
        }),
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
        url: '/pages/fav/index.html',
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
        attribute: JSON.stringify({
          isOffical: 1,
          integration: 2
        }),
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
        attribute: JSON.stringify({
          isOffical: 1,
          integration: 2
        }),
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
        attribute: JSON.stringify({
          isOffical: 1,
          integration: 2
        }),
        create_time: Date.now(),
        update_time: Date.now(),
        author: '想天软件',
        site: 'https://apps.vip/',
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
      },
      {
        nanoid:nanoid(8),
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
      }
    ]
    await sqlDb.knex('app').insert(defaultApps)
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
      case 'noFrame':
        words='无边框窗体'
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
