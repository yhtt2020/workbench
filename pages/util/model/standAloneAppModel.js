const db = require('../../../js/util/database.js').db
const serverConfig = require('../../../server-config.js').config
const systemAppPackage=[
  'com.thisky.group',
  'com.thisky.fav',
  'com.thisky.import',
  'com.thisky.helper',
  'com.thisky.imageEditor'
]  //包名为上述包名的判定为系统应用
const standAloneAppModel = {
  async initialize() {
    await db.standAloneApps.count().then((result) => {
      if (result === 0) {
        standAloneAppModel.insertDefaultApps()
      }
    })


    let group =await db.standAloneApps.get({name:'团队协作'})
    if(!!!group.package){
      await standAloneAppModel.setAppSetting(group.id, { autoRun: true ,showInSideBar:true})
      db.standAloneApps.update(group.id,{id:1,package:'com.thisky.group'})

      let com=await db.standAloneApps.get({name:'效率社区'})
      db.standAloneApps.update(com.id,{id:2,package:'s.apps.vip'})
      await standAloneAppModel.setAppSetting(com.id,{showInSideBar:true})

      let file=await db.standAloneApps.get({name:'文件小助手'})
      await standAloneAppModel.setAppSetting(file.id,{showInSideBar:true,alwaysTop:true})
      db.standAloneApps.update(file.id,{id:101,package:''})

      let nav = await  db.standAloneApps.get({name:'收藏夹'})
      await standAloneAppModel.setAppSetting(nav.id,{showInSideBar:true})
      db.standAloneApps.update(nav.id,{id:3,package:'com.thisky.nav'})
    }
    let nav = await  db.standAloneApps.get({name:'收藏夹'})
    db.standAloneApps.update(nav.id,{id:3,package:'com.thisky.fav'})
    if(group.url===serverConfig.IM.FRONT_URL_DEV + serverConfig.IM.AUTO_LOGIN){
      await db.standAloneApps.update(1,{url:serverConfig.IM.FRONT_URL + serverConfig.IM.AUTO_LOGIN})

    }
    db.standAloneApps.update(2,{package:'com.thisky.com','name':'元社区','url':'https://s.apps.vip','logo':'../../icons/apps/yuan.png'})
    await db.standAloneApps.update(2,{themeColor:'#4188ff'})
    await db.standAloneApps.update(3,{themeColor:'#8618d2'})
    let importHelper=await  db.standAloneApps.get({package:'com.thisky.import'})
    let importHelperApp=  {
      name: '导入助手',
      logo: '../../pages/import/img/logo.svg',
      summary: '快速导入其他浏览器的书签、密码，设置为您的默认浏览器。',
      type: 'local',
      url: '/pages/import/index.html',
      preload: '/pages/group/imPreload.js',
      package:'com.thisky.import',
      themeColor: '#689aff',
      userThemeColor: '',
      createTime: Date.now(),
      updateTime: Date.now(),
      accountAvatar: '',
      order: 0,
      useCount: 0,
      openNewWindow:'allow',//allow deny redirect 默认为redirect
      lastExecuteTime: Date.now(),
      settings: JSON.stringify({
        bounds: {
          width: 650,
          height: 700
        },
        showInSideBar:true
      }),
      unreadCount: 1,
    }
    if(!!!importHelper){
      db.standAloneApps.add(importHelperApp)
    }
    let timer= await db.standAloneApps.get({package:'com.thisky.timer'})
    if(timer){
      await db.standAloneApps.update(timer.id,{url:'https://a.apps.vip/timer',logo:'https://a.apps.vip/timer/icon.svg'})
    }


    let helper= await db.standAloneApps.get({package:'com.thisky.helper'})
    if(!!!helper){
      db.standAloneApps.add( {
        name: '帮助教程',
        logo: '../../icons/apps/help.png',
        url: 'https://www.yuque.com/tswork/ngd5zk/iuguin',
        package:'com.thisky.helper',
        themeColor: '#ff7b42',
        author: '想天软件',
        site: 'https://apps.vip/',
        checked: true,
        summary: '帮助手册，让你从零开始学会掌握想天浏览器。',
        settings: JSON.stringify({
          bounds: {
            width: 1200,
            height: 800
          },
          alwaysTop: false,
          showInSideBar: true,
        })
      })
    }
    let imageEditor = await db.standAloneApps.get({name:'图片编辑器'})
    if(imageEditor){
     await  db.standAloneApps.update(imageEditor.id,{package:'com.thisky.imageEditor',fileAssign:['image'],url:'https://a.apps.vip/imageEditor/','logo':'https://a.apps.vip/imageEditor/icon.svg'})
    }

  },
  async find(word,option){
    let result= await db.standAloneApps.orderBy(option.order).toArray()
    let searchResult=[]
    const pyjs=require('js-pinyin')
    result.forEach(item=>{
      let pinyin=pyjs.getFullChars(item.name).toLowerCase()
      function testWords(sourceStr,findWords){
        for(let i=0;i<findWords.length;i++){
          if(sourceStr.indexOf(findWords.charAt(i))===-1){
           return false
          }
        }
        return true
      }

      if(item.name.indexOf(word)>-1 ||
        item.url.indexOf(word)>-1 ||
        item.summary.indexOf(word)>-1 ||
        testWords(pinyin,word)
      ){
        item.settings=JSON.parse(item.settings)
        searchResult.push(item)
      }
    })
    // for(let i=0;i<result.length;i++){
    //   if(result[i].name.indexOf(word)>-1 || result[i].url.indexOf(word)>-1 || result[i].summary.indexOf(word)>-1){
    //     searchResult.push(result[i])
    //   }
    // }
    return searchResult
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
   * @param app 配置参数
   * @returns {Promise<void>}
   */
  async install(url = '', app = {}) {
    if (!!!url) return false
    let appInstall = {
      id:app.id?app.id:undefined,
      name: app.name,
      logo: app.logo,
      summary: app.summary || '',
      type: app.type || 'web',
      author:app.author?app.author:'',
      site:app.site?app.site:'',
      url: url,
      preload: '',
      package:app.package || '',
      themeColor: app.themeColor || '#ccc',
      userThemeColor: '',
      createTime: Date.now(),
      updateTime: Date.now(),
      accountAvatar: '',
      order: 0,
      useCount: 0,
      lastExecuteTime: Date.now(),
      settings:app.settings? JSON.stringify(app.settings):'[]',
      unreadCount: 0,
      showInSideBar: app.showInSideBar || false
    }
    return await db.standAloneApps.put(appInstall)
  },
  async getAllApps(option={}) {
    let result=[]
    if(option.order){
      result = await db.standAloneApps.orderBy(option.order).reverse().limit(option.limit).toArray()
    }else{
      result = await db.standAloneApps.toArray()
    }

    result.forEach((app) => {
      app.capture = ''
      app.isSystemApp=standAloneAppModel.isSystemApp(app)
      app.settings =app.settings? JSON.parse(app.settings):{}
    })
    return result
  },
  async get(id) {
    let data = false
    await db.standAloneApps.get(id).then((result) => {
      data = result
      data.settings=JSON.parse(data.settings)
      data.isSystemApp=standAloneAppModel.isSystemApp(data)
    }, (err) => {
      data = false
    })
    return data
  },
  async getFromPackage(packageName){
    return await db.standAloneApps.where({package:packageName}).first()
  },
  isSystemApp(app){
    app.package=app.package||''
    return systemAppPackage.indexOf(app.package)>-1
  },
  async update(id,object){
    return await db.standAloneApps.update(id,object)
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
        return true
      }).catch((err) => {
        console.log('存储app的setting失败')
      })
    }
  },
  /**
   * 插入系统内置应用
   * @returns {Promise<*>}
   */
  async insertDefaultApps() {
    const defaultApps = [
      {
        id:1,
        name: '团队协作',
        logo: '../../icons/svg/chat.svg',
        summary: '团队协作，与团队成员高效协作',
        type: 'web',
        //url: serverConfig.IM.FRONT_URL+ serverConfig.IM.AUTO_LOGIN,
        url: serverConfig.IM.FRONT_URL + serverConfig.IM.AUTO_LOGIN,
        preload: '/pages/group/imPreload.js',
        package:'com.thisky.group',
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
            width: 920,
            height: 720
          },
          autoRun: true,
          showInSideBar:true
        }),
        unreadCount: 0,
      },
      {
        id:2,
        name: '元社区',
        logo: '../../icons/apps/yuan.png',
        package:'com.thisky.com',
        summary: '用心经营您的元社区',
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
          },
          showInSideBar: true
        }),
        unreadCount: 0,
      },
      {
        id:3,
        name: '收藏夹',
        logo: '../../icons/svg/apps.svg',
        summary: '收集你的灵感，集锦',
        preload: '/pages/apps/preload.js',
        type: 'local',
        package: 'com.thisky.fav',
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
          },
          showInSideBar:true,
        }),
        unreadCount: 0,
      },
      {
        id:4,
        name: '导入助手',
        logo: '../../icons/apps/import.svg',
        summary: '快速导入其他浏览器的书签、密码，设置为您的默认浏览器。',
        type: 'local',
        //url: serverConfig.IM.FRONT_URL+ serverConfig.IM.AUTO_LOGIN,
        url: '/pages/import/index.html',
        preload: '/pages/group/imPreload.js',
        package:'com.thisky.import',
        themeColor: '#689aff',
        userThemeColor: '',
        createTime: Date.now(),
        updateTime: Date.now(),
        accountAvatar: '',
        order: 0,
        useCount: 0,
        lastExecuteTime: Date.now(),
        settings: JSON.stringify({
          bounds: {
            width: 920,
            height: 720
          },
          showInSideBar:true
        }),
        unreadCount: 1,
      },
      {
        id:5,
        name: '图片编辑器',
        themeColor: 'rgb(90,170,60)',
        author: '想天软件',
        site: 'http://apps.vip',
        logo: 'https://a.apps.vip/imageEditor/icon.svg',
        url: 'https://a.apps.vip/imageEditor/',
        package: 'com.thisky.imageEditor',
        summary: '可以为您的图片增加相框、贴纸、文字、进行简单裁减、旋转，还可以添加滤镜。',
        fileAssign:['image']
      },
      {
        id:7,
        name: '帮助教程',
        logo: '../../icons/apps/help.png',
        url: 'https://www.yuque.com/tswork/ngd5zk/iuguin',
        package:'com.thisky.helper',
        themeColor: '#ff7b42',
        author: '想天软件',
        site: 'https://apps.vip/',
        checked: true,
        summary: '帮助手册，让你从零开始学会掌握想天浏览器。',
        settings: JSON.stringify({
          bounds: {
            width: 1200,
            height: 800
          },
          alwaysTop: false,
          showInSideBar: true,
        })
      }
    ]
    return await db.standAloneApps.bulkAdd(defaultApps)
  },
  /**
   * 设置转中文表达
   * @param setting
   */
  settingToWords(setting){
    //keepRunning', 'theme', 'desktop', 'showInSideBar', 'alwaysTop', 'autoRun'
    let words=''
    switch (setting){
      case 'bounds':
        words='窗口大小'
        break
      case 'keepRunning':
        words='保持运行'
        break
      case 'showInSideBar':
        words='保持在左侧栏'
        break
      case 'alwaysTop':
        words='窗口置顶'
        break
      case 'autoRun':
        words='自动运行'
        break
    }
    return words
  },
  async countApps() {
    return await db.standAloneApps.count()
  },
  async getFileAssginApps(fileType){
    let assigned=await db.standAloneApps.where('fileAssign').equals(fileType).toArray()
    if(assigned){
      assigned.forEach(item=>{
        item.isSystemApp=standAloneAppModel.isSystemApp(item)
      })
    }

    return assigned
  }

}
module.exports = standAloneAppModel
