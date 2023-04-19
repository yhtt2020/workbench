import {defineStore} from "pinia";
import * as util from "util";
import {nanoid} from 'nanoid'
import {myStore} from './util.js'
import dbStorage from "./store/dbStorage";
// import _ from 'lodash-es';
// const {appModel, devAppModel} = window.$models


// @ts-ignore
export const appStore = defineStore('appStore', {
  state: () => ({
    userInfo: false,
    lvInfo: {},
    myData: {
      myCircle: [],
      joinedCircle: []
    },
    agreeTest:false,

    init: false, //是否已经初始化

    fullScreen: false, //是否是全屏模式

    settings: {
      houserun:false,//rgb跑马灯
      zoomFactor:100,//缩放比
      openUrlBrowser: 'builtin',//默认打开浏览器
      enableChat: true,//主界面显示聊天
      preventLock: false,//阻止锁屏

      enableBarrage: true, //启用弹幕
      barrage: {
        height: 100, //单个轨道的高度
        limit: 10, //单个屏幕允许的数量
        repeat: 3, //重复次数
        direction: "left",
        browserLink: true, //和浏览器联动
      }, //弹幕设置
      ui: {}, //ui设置
      showButtonTitle: false,
      darkMod: true, //深色模式
      attachScreen: null, //id,bounds
    },

    routeUpdateTime: Date.now(),//用于更新滚动条
    status: {
      music: {//存当前播放的音乐
        notInit: true,
        cover: '',
        title: ''
      }
    },
    backgroundSettings:{
      backGroundImgBlur:0,
      backGroundImgLight:0.3,
    },
    backgroundImage:{
      path:''
    }


  }),
  getters: {},

  actions: {
    setBackgroundImage(value){
      this.backgroundImage = value
    },
    setAgreeTest(value){
      this.agreeTest = value
    },
    reset() {
      this.fullScreen = false
    },


    /**
     * 结束新手引导
     */
    finishWizard() {
      this.init = true;
    },

    setMusic(status) {
      this.status.music = status;
      this.status.music.cover = status.cover.replace("34y34", "120y120"); //修正封面
    },

    getUserInfo(){
      ipc.send('getDetailUserInfo')
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
            icon: 'file://' + window.globalArgs['app-dir_name'] + `/../../icons/grade/${name}.svg`
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
      paths:['status','settings','init','agreeTest','backgroundSettings','backgroundImage'],
      storage: dbStorage,
      // state 中的字段名，按组打包储存
    }]
  }
}, {})
