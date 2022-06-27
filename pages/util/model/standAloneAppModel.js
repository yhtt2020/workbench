const appStoreData = require('../../appStore/app.js')
const db = require('../../../js/util/database.js').db
const serverConfig = require('../../../server-config.js').config
const tools = require('../util.js').tools;
const systemAppPackage=[
  'com.thisky.group',
  'com.thisky.fav',
  'com.thisky.import',
  'com.thisky.helper',
  'com.thisky.imageEditor',
  'com.thisky.nav',
  'com.thisky.appStore',
  'com.thisky.com'
]  //包名为上述包名的判定为系统应用
const standAloneAppModel = {
  async initialize() {
    await db.standAloneApps.count().then((result) => {
      if (result === 0) {
        standAloneAppModel.insertDefaultApps()
      }
    })


    let group =await db.standAloneApps.get({name:'团队协作'})
    // if(!!!group || !!!group.package){
    //   await standAloneAppModel.setAppSetting(group.id, { autoRun: true ,showInSideBar:true})
    //   db.standAloneApps.update(group.id,{id:1,package:'com.thisky.group'})
    //
    //   let com=await db.standAloneApps.get({name:'效率社区'})
    //   db.standAloneApps.update(com.id,{id:2,package:'s.apps.vip'})
    //   await standAloneAppModel.setAppSetting(com.id,{showInSideBar:true})
    //
    //   let file=await db.standAloneApps.get({name:'文件小助手'})
    //   await standAloneAppModel.setAppSetting(file.id,{showInSideBar:true,alwaysTop:true})
    //   db.standAloneApps.update(file.id,{id:101,package:''})
    //
    //   let nav = await  db.standAloneApps.get({name:'收藏夹'})
    //   await standAloneAppModel.setAppSetting(nav.id,{showInSideBar:true})
    //   db.standAloneApps.update(nav.id,{id:3,package:'com.thisky.nav'})
    // }
    let nav = await  db.standAloneApps.get({name:'收藏夹'})
    if(nav){
      db.standAloneApps.update(nav.id,{
        package:'com.thisky.nav',
        url: '/pages/apps/index.html',
      })
    }


    if(group){
      db.standAloneApps.update(group.id,{
        name:'团队沟通',
        logo:'../../pages/group/group.svg'
      })
    }

    let fav = await  db.standAloneApps.get({name:'超级收藏夹'})
    db.standAloneApps.put({
      id:fav?fav.id:8,
      name: '超级收藏夹',
      logo: '../../pages/fav/fav.svg',
      summary: '整理你的超级资料库',
      preload: '/pages/fav/preload.js',
      type: 'local',
      package: 'com.thisky.fav',
      url: '/pages/fav/index.html',
      themeColor: '#3c78d8',
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
    })
    // if(group.url===serverConfig.IM.FRONT_URL_DEV + serverConfig.IM.AUTO_LOGIN){
    //   await db.standAloneApps.update(1,{url:serverConfig.IM.FRONT_URL + serverConfig.IM.AUTO_LOGIN})
    //
    // }
    db.standAloneApps.update(2,{package:'com.thisky.com','name':'元社区','url':'https://s.apps.vip','logo':'../../icons/apps/yuan.png'})
    await db.standAloneApps.update(2,{themeColor:'#4188ff'})
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

    if(!await standAloneAppModel.isInstalled('com.thisky.appStore')){
      let appStoreData=require('../../appStore/app.js')
      standAloneAppModel.installFromJson(appStoreData)
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
    }else{
      await db.standAloneApps.add({
        name: '图片编辑器',
        themeColor: 'rgb(90,170,60)',
        author: '想天软件',
        site: 'http://apps.vip',
        logo: 'https://a.apps.vip/imageEditor/icon.svg',
        url: 'https://a.apps.vip/imageEditor/',
        package: 'com.thisky.imageEditor',
        createTime: Date.now(),
        updateTime: Date.now(),
        summary: '可以为您的图片增加相框、贴纸、文字、进行简单裁减、旋转，还可以添加滤镜。',
        isNew:true,
        settings:'[]',
        fileAssign:['image']
      })
    }

  },
  async find(word,option){
    let result= await db.standAloneApps.orderBy(option.order).toArray()
    let searchResult=[]

    const { pinyin } = require('pinyin-pro');

    function checkMatched(item) {
      return searchResult.some(v => v.name === item.name)
    }

    function dealItem(item) {
      if(item.hasOwnProperty('settings')) {
        item.settings=JSON.parse(item.settings)
      }
    }

    function matchChinese(str) {
      return str.match(/[\u4e00-\u9fa5]/g)
    }

    function intelligentMatch(arr, word) {
      if (word.length <= 1) return false;
      if (!/^[\u4e00-\u9fa5_a-zA-Z]+$/.test(word)) return false;
      let result = false;
      let stop = false;
      let wordArr = word.split("");

      function recur(targetArrParam, wordArrParam, targetIndexParam, wordArrIndexParam) {
        if (stop === false && wordArrParam.length <= targetArrParam.length && wordArrParam[wordArrIndexParam + 1]) {
          if (targetArrParam[targetIndexParam + 1] === wordArrParam[wordArrIndexParam + 1]) {
            result = true;
          } else {
            result = false;
            stop = true;
          }
          recur(targetArrParam, wordArrParam, targetIndexParam + 1, wordArrIndexParam + 1);
        }
      }

      let arrIndex = 0;
      let wordArrIndex = 0;
      let needToRecur = false;
      for (let i = 0; i < arr.length; i++) {
        if (needToRecur) break;
        for (let j = 0; j < wordArr.length; j++) {
          if (needToRecur) break;
          if (wordArr[j] === arr[i] && arr[i + 1]) {
            arrIndex = i;
            wordArrIndex = j;
            needToRecur = true;
          }
        }
      }

      if (needToRecur) {
        recur(arr, wordArr, arrIndex, wordArrIndex);
      }
      return result;
    }

    result.forEach(item => {
      if(matchChinese(item.name) && matchChinese(item.summary)) {
        let quanPinName = pinyin(matchChinese(item.name).join(''), { toneType: 'none', type: 'array' })   // 获取数组形式不带声调的拼音
        let firstPinName = pinyin(matchChinese(item.name).join(''), { pattern: 'first', toneType: 'none', type: 'array' })   // 获取数组形式不带音调拼音首字母
        let quanPinSummary = pinyin(matchChinese(item.summary).join(''), { toneType: 'none', type: 'array' })   // 获取数组形式不带声调的拼音
        let firstPinSummary = pinyin(matchChinese(item.summary).join(''), { pattern: 'first', toneType: 'none', type: 'array' })

        if((item.name.toLowerCase().includes(word) || item.summary.includes(word) || tools.execDomain(item.url).toLowerCase().includes(word)) && !checkMatched(item)) {
          dealItem(item)
          searchResult.push(item)
        }

        quanPinName.forEach((v, index) => {
          if(v === word && !checkMatched(item)) {
            dealItem(item)
            searchResult.push(item)
          } else if (quanPinName.join('') === word && !checkMatched(item)) {
            dealItem(item)
            searchResult.push(item)
          } else if (index <= quanPinName.length -2 && word.includes(v.concat(quanPinName[index +1])) && !checkMatched(item)) {
            dealItem(item)
            searchResult.push(item)
          }
        })
        if(intelligentMatch(firstPinName, word) && !checkMatched(item)) {
          dealItem(item)
          searchResult.push(item)
        }

        quanPinSummary.forEach((v, index) => {
          if(v === word && !checkMatched(item)) {
            dealItem(item)
            searchResult.push(item)
          } else if (quanPinSummary.join('') === word && !checkMatched(item)) {
            dealItem(item)
            searchResult.push(item)
          } else if (index <= quanPinSummary.length -2 && word.includes(v.concat(quanPinSummary[index +1])) && !checkMatched(item)) {
            dealItem(item)
            searchResult.push(item)
          }
        })
        if(intelligentMatch(firstPinSummary, word) && !checkMatched(item)) {
          dealItem(item)
          searchResult.push(item)
        }
      }
    })
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
   * 从json安装应用
   * @param json
   * @returns {Promise<void>}
   */
  async installFromJson(json){
    return await standAloneAppModel.install(json.url,json)
  },
  async isInstalled (package) {
    let app = await standAloneAppModel.getFromPackage(package)
    return !!app
  },
  async isInstalledByUrl(url){
    return !! await db.standAloneApps.get({'url':url})
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
      auth:app.auth?JSON.stringify(app.auth):'[]',
      unreadCount: 0,
      isNew:true
    }
    let hasInstalled=false
    if(app.package){
      hasInstalled=standAloneAppModel.isInstalled(app.package)
      if(!hasInstalled)
      {
        return false
      }
    }
    return await db.standAloneApps.put(appInstall)
  },
  /**
   *
   * @param option  order,limit
   * @returns {Promise<*>}
   */
  async getAllApps(option={}) {
    let result=[]
    let query=db.standAloneApps
    if(option.order){
      query = query.orderBy(option.order).reverse()
    }
    if(option.limit){
      query = query.limit(option.limit)
    }
    result=await query.toArray()

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
    let app= await db.standAloneApps.where({package:packageName}).first()
    if(!!!app){
      return false
    }
    app.settings=JSON.parse(app.settings)
    app.isSystemApp=standAloneAppModel.isSystemApp(app)
    return app
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
      console.warn('app不存在')
    } else {
      let DBSavedSettings = JSON.parse(app.settings)
      let newSettings = Object.assign(DBSavedSettings, settings)
      await db.standAloneApps.update(id, {"settings": JSON.stringify(newSettings)}).then((result) => {
        return true
      }).catch((err) => {
        console.warn('存储app的setting失败')
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
        name: '团队沟通',
        logo: '../../pages/group/group.svg',
        summary: '团队沟通，随时与团队成员实时沟通',
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
        isNew:true,
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
            width: 1200,
            height: 800
          },
          showInSideBar: true
        }),
        isNew:true,
        unreadCount: 0,
      },
      {
        id:8,
        name: '超级收藏夹',
        logo: '../../pages/fav/fav.svg',
        summary: '整理你的超级资料库',
        preload: '/pages/fav/preload.js',
        type: 'web',
        package: 'com.thisky.fav',
        url: 'http://a.apps.vip/fav/',
        themeColor: '#3c78d8',
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
          showInSideBar:false,
        }),
        isNew:true,
        unreadCount: 0,
      },
      {
        id:4,
        name: '导入助手',
        logo: '../../pages/import/img/logo.svg',
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
            width: 645,
            height: 415
          },
          showInSideBar:false
        }),
        isNew:true
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
        createTime: Date.now(),
        updateTime: Date.now(),
        summary: '可以为您的图片增加相框、贴纸、文字、进行简单裁减、旋转，还可以添加滤镜。',
        isNew:true,
        settings:'[]',
        fileAssign:['image']
      },
      {
        id:7,
        name: '帮助教程',
        logo: '../../icons/apps/help.png',
        url: 'https://www.yuque.com/tswork/ngd5zk/iuguin',
        package:'com.thisky.helper',
        themeColor: '#ff7b42',
        createTime: Date.now(),
        updateTime: Date.now(),
        author: '想天软件',
        site: 'https://apps.vip/',
        checked: true,
        summary: '帮助手册，让你从零开始学会掌握想天浏览器。',
        isNew:true,
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
    await db.standAloneApps.bulkAdd(defaultApps)
    let appStoreData=require('../../appStore/app.js')
    await standAloneAppModel.installFromJson(appStoreData)
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
      case 'disableWebSecurity':
        words='本地权限'
        break
    }
    return words
  },
  authToWords(auth){
    let words=''
    switch (auth){
      case 'webSecure':
        words='跨域请求'
        break
      case 'setWallpaper':
        words='设置壁纸'
        break
      case 'download':
        words='下载文件'
          break
      case 'node':
        words='Node集成'
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
