const settings = require('util/settings/settings.js')
const statsh = require('util/statsh/statsh.js')
const axios = require('../src/util/axios')
const { db } = require('./util/database');

const userStatsModel = require('../pages/util/model/userStatsModel')
const standAloneAppModel = require('../pages/util/model/standAloneAppModel')
const userModel = require("../src/model/userModel");

const statistics = {
  envGetters: [],
  registerGetter: function (key, fn) {
    statistics.envGetters.push({ key, fn })
  },
  usageDataCache: {},
  getValue: function (key) {
    return statistics.usageDataCache[key]
  },
  setValue: function (key, value) {
    statistics.usageDataCache[key] = value
  },
  incrementValue: function (key, value) {
    if (statistics.usageDataCache[key]) {
      statistics.usageDataCache[key]++
    } else {
      statistics.usageDataCache[key] = 1
    }
  },
  async upload () {
    if (settings.get('collectUsageStats') === false) {
      return
    }

    var usageData = Object.assign({}, statistics.usageDataCache || {})

    // avoid uploading more than a week's worth of old data, in the case that uploads fail indefinitely
    if (usageData.created && (Date.now() - usageData.created) > (7 * 24 * 60 * 60 * 1000)) {
      usageData = {}
      statistics.usageDataCache = {
        created: Date.now()
      }
    }

    statistics.envGetters.forEach(function (getter) {
      try {
        usageData[getter.key] = getter.fn()
      } catch (e) {
        console.warn(e)
      }
    })
    const result = await db.system.where('name').equals('currentUser').first()
    //mark插入对apps的数据统计
    let appNum = await standAloneAppModel.countApps()
    await userStatsModel.setValue('apps', appNum)

    //statsh
    statsh.do({
      action: 'set',
      key: 'apps',
      value: appNum
    })

    //mark插入对blockAds的数据统计
    let currentBlockAds = settings.get('filteringBlockedCount')
    await userStatsModel.setValue('blockAds', currentBlockAds)

    //statsh
    statsh.do({
      action: 'set',
      key: 'blockAds',
      value: currentBlockAds
    })

    const defaultUserStats = {
      apps: 0,
      appsExecutedCounts: 0,
      blockAds: 0,
      browserBaseClose: 0,
      browserBaseOpen: 0,
      defaultBrowser: 0,
      globalSearchBaseOpenApp: 0,
      globalSearchBaseOpenTask: 0,
      globalSearchBaseShortOpen: 0,
      guideFeatureComplete: 0,
      guideNewComplete: 0,
      password: 0,
      scripts: 0,
      searchCounts: 0,
      tabs: 0,
      tasks: 0,
      userInfoMedal: 0,
      webviewsInk: 0,
    }

    const options = {
      uid: result.value.uid != 0 ? result.value.uid : 0,   //用户uid
      client_id: settings.get('clientID'),     //设备号
      install_time: String(settings.get('installTime')),  //初次安装的时间
      submit_time: String(Date.now()),     //最新提交数据时间
      os: `${process.platform}/${process.getSystemVersion()}`,    //操作系统版本
      lang: navigator.language,  //本地语言
      app_version: window.globalArgs['app-version'],   //浏览器版本号
      app_name: window.globalArgs['app-name'],   //浏览器名称
      is_dev: 'development-mode' in window.globalArgs,    //是否是开发化境
      user_info: result.value.uid != 0 ? result.value : {},  //登录账户数据
      usage_data: usageData, //用户部分数据统计，min自带，后续看是否去掉... //todo
      user_stats: Object.assign(defaultUserStats, statsh.getAll())
    }
    axios.post('/app/open/usageStats/addStats', options).then(async res => {
      statistics.usageDataCache = {
        created: Date.now()
      }
      settings.set('usageData', null)
      statsh.reset()
      await userStatsModel.reset()
    }).catch(e => {
      console.warn('failed to send usage statistics', e)
    })

    //职业统计上报 上报完过一次设置为null，除非career再次被赋值才会上报
    if(settings.get('career')) {
      axios.post('/app/open/usageStats/addCareer', {
        career: settings.get('career'),
        uid: result.value.uid != 0 ? result.value.uid : 0,   //用户uid
        client_id: settings.get('clientID')   //设备号
      }).then(res => {
        settings.set('career', null)
      })
    }
  },

  async uploadCumulativeTime() {
    const userInfo = await userModel.getCurrent()
    const options = {
      uid:  userInfo && userInfo.data.uid != 0 ? userInfo.data.uid : 0,  //用户uid
      client_id: settings.get('clientID'),     //设备号
    }

    axios.post('/app/open/usageStats/cumulativeTime', options).catch(e => {
      console.warn('failed to send cumulative', e)
    })
  },

  initialize: async function () {
    await userStatsModel.initialize()

    //初次安装的用户需要往dexie的system表中插入此数据，否则第一次上传会报错
    if(await db.system.count() === 0) {
      await db.system.put({
        name: "currentUser",
        value: {
          avatar: "../../icons/browser.ico",
          nickname: "立即登录",
          uid: 0
        }
      })
    }

    //statsh 插入打开浏览器那一次统计
    statsh.do({
      action: 'set',
      key: 'browserBaseOpen',
      value: 1
    })

    setTimeout(statistics.upload, 10 * 1000) //启动10秒后上报
    setInterval(statistics.upload, 3 * 60 * 1000) //每隔3分钟上报一次
    setInterval(statistics.uploadCumulativeTime, 1000 * 60) //每分钟上报在线时间

    statistics.usageDataCache = settings.get('usageData') || ({
      created: Date.now()
    })

    setInterval(function () {
      if (settings.get('collectUsageStats') === false) {
        settings.set('usageData', null)
      } else {
        settings.set('usageData', statistics.usageDataCache)
      }
    }, 60 * 1000)

    //初始化的时候检验一下证书过期的白名单是否已经创建
    if(settings.get('whiteCertInvalid') == undefined) {
      settings.set('whiteCertInvalid', [])
    }

    setInterval(() => {
      ipc.invoke('statshNoobGuide').then((res) => {
        //statsh 完成新用户引导统计
        statsh.do({
          action: 'set',
          key: 'guideNewComplete',
          value: Object.values(res.modules.noobGuide).findIndex(v => v === false) < 0 ? 1 : 0
        })

        //statsh 完成功能使用引导统计
        statsh.do({
          action: 'set',
          key: 'guideFeatureComplete',
          value: Object.values(res.modules.feature).findIndex(v => v === false) < 0 ? 1 : 0
        })

        //statsh 获取勋章统计
        statsh.do({
          action: 'set',
          key: 'userInfoMedal',
          value: res.medal ? 1 : 0
        })
      })
    }, 2 * 60 * 1000)

    /* 注释掉此段关于用户关闭信息收集按钮后的重制设备ID的问题 */
    settings.listen('collectUsageStats', function (value) {
      if (value === false) {
        // disabling stats collection should reset client ID
        // settings.set('clientID', undefined)
        return
      } else if (!settings.get('clientID')) {
        settings.set('clientID', require('nanoid').nanoid(8))
      }
    })

    if (!settings.get('installTime')) {
      // round install time to nearest hour to reduce uniqueness
      const roundingFactor = 60 * 60 * 1000
      settings.set('installTime', Math.floor(Date.now() / roundingFactor) * roundingFactor)
    }

    statistics.registerGetter('contentTypeFilters', function () {
      return (settings.get('filtering') || {}).contentTypes
    })
  }
}

module.exports = statistics
