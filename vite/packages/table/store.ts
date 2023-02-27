import {defineStore} from "pinia";
import * as util from "util";
import {nanoid} from 'nanoid'
// import _ from 'lodash-es';
// const {appModel, devAppModel} = window.$models


export const appStore = defineStore('appStore', {
  state: () => ({
    userInfo:false,


    apps: [],

    appData: {//应用数据
      weather: {
        cities: []
      }
    },

    init: false,//todo 增加初始化设置的保存 是否初始设置过了

    fullScreen: false,//是否是全屏模式

    settings: {
      showButtonTitle: false,
      darkMod: true,
      attachScreen: null//id,bounds
    },

    routeUpdateTime: Date.now(),//用于更新滚动条
    status: {
      music: {//存当前播放的音乐
        notInit: true,
        cover: '',
        title:''
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
    save(key, value) {
      localStorage.setItem(key, JSON.stringify(value))
    },

    loadAll() {
      this.loadAppData()
      this.init = !!localStorage.getItem('init')
    },

    finishWizard() {
      this.init = true
      localStorage.setItem('init', 'true')
    },

    setMusic(status) {
      this.status.music = status
      this.status.music.cover = status.cover.replace('34y34', '120y120')//修正封面
      this.save('status.music', status)
    },

    loadMusic() {
      let music=JSON.parse(localStorage.getItem('status.music'))
      if(music){
        this.status.music =music
      }
    },
    loadAppData() {
      let saved=localStorage.getItem('appData.weather')
      if(saved) {
        let weather= JSON.parse(saved)
        console.log(weather)
        this.appData.weather = weather
      }
      this.loadMusic()
    },
    addApps(apps) {
      this.apps = this.apps.concat(apps)
    },

    addCity(city) {
      this.appData.weather.cities.push(city)
      this.saveWeather()
    },
    saveWeather() {
      this.save('appData.weather', this.appData.weather)
    },
    removeCity(cityId) {
      this.appData.weather.cities = this.appData.weather.cities.filter(city => {
        return city.id !== cityId
      })
      this.saveWeather()
    },
    setUser(userInfo){
      userInfo.onlineGradeExtra.cumulativeMinutes= userInfo.onlineGradeExtra.cumulativeHours % 60
      userInfo.onlineGradeExtra.cumulativeMinute = userInfo.onlineGradeExtra.minutes
      userInfo.onlineGradeIcons={}
      userInfo.onlineGradeIcons.crown = []
      userInfo.onlineGradeIcons.sun = []
      userInfo.onlineGradeIcons.moon = []
      userInfo.onlineGradeIcons.star = []
      function handleGrade(name){
        for(let i = 0; i < userInfo.onlineGrade[name]; i++) {
          userInfo.onlineGradeIcons[name].push({
            icon: 'file://' +window.globalArgs['app-path']+`/icons/grade/${name}.svg`
          })
        }
      }
      console.log(userInfo)

      Object.keys( userInfo.onlineGrade).forEach(v => handleGrade(v))
      this.userInfo=userInfo
    }
  }
})

