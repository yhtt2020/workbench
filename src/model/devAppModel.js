const { pinyin } = require('pinyin-pro')
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
const devAppModel = {
  async initDb () {
    /**
     *  standAloneApps:'++id,name,package,logo,summary,type,url,theme_color,user_theme_color,create_time,updateTime,accountAvatar
     *  ,order,useCount,lastExecuteTime,settings,unreadCount,*fileAssign,auth,isNew,attribute',//新增两个字段方便应用市场查找筛选
     */
    let exists = await sqlDb.knex.schema.hasTable('dev_app')
    if (!exists) {
      console.log('检测到app开发表不存在，自动创建')
      await sqlDb.knex.schema.createTable('dev_app', function (t) {
        t.string('nanoid').primary().unique().comment('本地id和应用id无关') //本地id
        t.string('app_nanoid').comment('appstore的应用nanoid，需要从远端获取，和package差不多')//
        t.string('assign_apps').comment('关联的系统内已安装的app') //关联的系统内已安装的app
        t.string('name').comment('英文名称，这个不要求唯一')
        t.string('options').comment('基本设置')
        t.string('author').comment('开发者名称')
        t.string('package').comment('包名，需要从云端申请后填入，是应用的唯一可读身份标识')
        t.string('preload').comment('预载文件')
        t.string('url').comment('最低优先级url')
        t.string('logo').comment('应用的logo，需要自动将本地文件导入到开发文件下面')
        t.string('summary').comment('应用的简介')
        t.string('site').comment('应用的官网')
        t.string('type').comment('可以是web应用或者本地应用，web应用不允许使用preload和api')
        t.string('auth').comment('权限，为json序列化')
        t.string('window').comment('窗体设置')
        t.string('theme_color').comment('主题色')
        t.integer('create_time').comment('首次创建的时间') //
        t.integer('update_time')
        t.string('file_assign')
      })
    } else {
    }
  },
  async migrateDB () {

  },

  /**
   * sqldb
   * @returns {Promise<void>}
   */
  async initialize () {
    await devAppModel.initDb()

    //await devAppModel.ensureAppsData()

  },
  /**
   * 检查该开发应用是否存在
   * @param nanoid
   * @returns {Promise<boolean>}
   */
  async checkExistsByAppId (nanoid) {
    let all = await sqlDb.knex('dev_app').select()
    let found=false
    all.forEach(devApp => {
      let assignApps = JSON.parse(devApp.assign_apps)
      if (assignApps.indexOf(nanoid) > -1) {
        found= devApp
        return false
      }
    })
    return found
  },
  async createFromApp (app) {
    let generate_nanoid = nanoid(4)
    let devApp = {
      nanoid:generate_nanoid,
      assign_apps: JSON.stringify([app.nanoid]),
      name: app.name,
      package: app.package,
      author: app.author,
      site: app.site,
      summary: app.summary,
      type: 'web',
      file_assign: [],
      url: app.url,
      preload: app.preload,
      logo: app.logo,
      theme_color: app.theme_color,
      window: {},
      auth: {},
      create_time: Date.now(),
      update_time: Date.now(),
    }
    let res = await sqlDb.knex('dev_app').insert(devApp)
    if (res) {return devApp} else {
      return false
    }
  },
  async get(nanoid){
    return await sqlDb.knex('dev_app').select({nanoid}).first()
  },
  async getAll(){
    return await sqlDb.knex('dev_app').select()
  }
}
module.exports = devAppModel
