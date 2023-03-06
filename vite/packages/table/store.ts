import {defineStore} from "pinia";
import * as util from "util";
import {nanoid} from 'nanoid'
import {myStore} from './util.js'
// import _ from 'lodash-es';
// const {appModel, devAppModel} = window.$models

const DEFAULT_PAPERS_SETTINGS = {
  enable: true,
  playType: 'my',
  showTime: true,
  showWeather: true,
  showProgress: true,
  usePassword: false,
  password: '',
  showUnreadMessage: true,
  lockTimeout: 300,
  interval: 3,
  savePath: '',
  tipLock: true//在状态栏提示多久锁屏
}

// @ts-ignore
export const appStore = defineStore('appStore', {
  state: () => ({
    userInfo: false,
    myData: {
      myCircle: [],
      joinedCircle: []
    },


    apps: [],

    lockTimeout: 300,//锁屏延迟

    appData: {//应用数据
      weather: {//天气
        cities: [],//当前城市
        lastUpdateTime: 0,//最后一次更新时间
      },
      papers: {
        myPapers: [],//我的壁纸收藏
        activePapers: [],//当前激活的壁纸
        playingPaper: null,//播放中的壁纸
        settings: undefined,
        tipLock: true,//在状态栏提示还有多久进入锁屏
        lockTimeout: 300,
        settings: {}
      }
    },

    init: false,//是否已经初始化

    fullScreen: false,//是否是全屏模式

    settings: {
      enableChat: true,//主界面显示聊天
      preventLock: false,//阻止锁屏

      enableBarrage: true,//启用弹幕
      barrage: {
        height: 100,//单个轨道的高度
        limit: 10,//单个屏幕允许的数量
        repeat: 3,//重复次数
        direction: 'left',
        browserLink: true,//和浏览器联动
      },//弹幕设置
      ui: {},//ui设置
      showButtonTitle: false,
      darkMod: true,//深色模式
      attachScreen: null//id,bounds
    },

    routeUpdateTime: Date.now(),//用于更新滚动条
    status: {
      music: {//存当前播放的音乐
        notInit: true,
        cover: '',
        title: ''
      }
    },
    decks: [
      {
        id: 1,
        title: '板子1',
        children: [
          {
            icon: '',
            cover: '',
            title: '微信'
          },
          {
            icon: '',
            cover: '',
            title: '微信'
          }
        ]
      },
      {
        id: 2,
        title: '板子1',
        children: [
          {
            icon: '',
            cover: '',
            title: '微信'
          },
          {
            icon: '',
            cover: '',
            title: '微信'
          },
          {
            icon: '',
            cover: '',
            title: '微信'
          }
        ]
      },
    ]

  }),
  getters: {},

  actions: {


    addToActive(image) {
      let found = this.appData.papers.activePapers.findIndex(img => {
        if (img.src === image.src)
          return true
      })
      if (found === -1) {
        this.appData.papers.activePapers.push(image)
      } else {
        this.appData.papers.activePapers.splice(found, 1)
      }
      console.log(this.appData.papers)
    //  this.saveAppData('papers')
    },
    /**
     * 添加到我的壁纸
     * @param image
     */
    addToMyPaper(image) {
      let found = this.appData.papers.myPapers.findIndex(img => {
        if (img.src === image.src)
          return true
      })
      if (found === -1) {
        this.appData.papers.myPapers.push(image)
      } else {
        this.appData.papers.myPapers.splice(found, 1)
      }
     // this.saveAppData('papers')
    },
    /**
     * 重置全部壁纸设置
     */
    resetPapersSettings() {
      this.appData.papers.settings = DEFAULT_PAPERS_SETTINGS
    },

    /**
     * 结束新手引导
     */
    finishWizard() {
      this.init = true
    },

    setMusic(status) {
      this.status.music = status
      this.status.music.cover = status.cover.replace('34y34', '120y120')//修正封面
    },



    /**
     * 添加城市
     * @param city
     */
    addCity(city) {
      this.appData.weather.cities.push(city)
      this.saveWeather()
    },
    /**
     * 保存单个应用的数据
     * @param app
     */
    saveAppData(app) {
      this.save('appData.' + app, this.appData[app])
    },
    /**
     * 保存天气
     */
    saveWeather() {
      this.save('appData.weather', this.appData.weather)
    },
    /**
     * 移除城市
     * @param cityId
     */
    removeCity(cityId) {
      this.appData.weather.cities = this.appData.weather.cities.filter(city => {
        return city.id !== cityId
      })
      this.saveWeather()
    },
    /**
     * 设置当前用户
     * @param userInfo
     */
    setUser(userInfo) {
      userInfo.onlineGradeExtra.cumulativeMinutes = userInfo.onlineGradeExtra.cumulativeHours % 60
      userInfo.onlineGradeExtra.cumulativeMinute = userInfo.onlineGradeExtra.minutes
      userInfo.onlineGradeIcons = {}
      userInfo.onlineGradeIcons.crown = []
      userInfo.onlineGradeIcons.sun = []
      userInfo.onlineGradeIcons.moon = []
      userInfo.onlineGradeIcons.star = []

      function handleGrade(name) {
        for (let i = 0; i < userInfo.onlineGrade[name]; i++) {
          userInfo.onlineGradeIcons[name].push({
            icon: 'file://' + window.globalArgs['app-path'] + `/icons/grade/${name}.svg`
          })
        }
      }

      Object.keys(userInfo.onlineGrade).forEach(v => handleGrade(v))
      this.userInfo = userInfo
    }
  },
  persist: {
    enabled: true,
    strategies: [{
      // 自定义存储的 key，默认是 store.$id
      // 可以指定任何 extends Storage 的实例，默认是 sessionStorage
      storage: localStorage,
      // state 中的字段名，按组打包储存
    }]
  }
}, {})

