import { defineStore } from "pinia";
import * as util from "util";
import {nanoid} from 'nanoid'
import {myStore} from './util.js'
// import _ from 'lodash-es';
// const {appModel, devAppModel} = window.$models



// @ts-ignore
export const appStore = defineStore('appStore', {
  state: () => ({
    userInfo: false,
    myData: {
      myCircle: [],
      joinedCircle: []
    },


      apps: [],

      lockTimeout: 300, //锁屏延迟

      init: false, //是否已经初始化

      fullScreen: false, //是否是全屏模式

    settings: {
      openUrlBrowser:'builtin',//默认打开浏览器
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


  }),
  getters: {},

  actions: {
    reset(){
      this.fullScreen=false
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
        this.init = true;
    },

      setMusic(status) {
        this.status.music = status;
        this.status.music.cover = status.cover.replace("34y34", "120y120"); //修正封面
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

export const tableStore = defineStore(
  "tableStore",
  {
    state: () => {
      return {
        countdownDay: [],
        appDate: {},
        clockEvent: [],
        customComponents: [],
      };
    },

    actions: {
      setAppDate(value) {
        this.appDate = value;
      },

      addCountdownDay(value) {
        this.countdownDay.push(value);

        //   this.saveCountdownDay();
      },
      removeCountdownDay(index) {
        this.countdownDay.splice(index, 1);
      },
      addClock(value) {
        this.clockEvent.push(value);
        this.sortClock();
      },
      sortClock() {
        this.clockEvent.sort((v1, v2) => {
          let value1 = v1.dateValue;
          let value2 = v2.dateValue;
          if (value1.hours === value2.hours) {
            return value1.minutes - value2.minutes;
          }
          return value1.hours - value2.hours;
        });
        const a = this.clockEvent.filter((value) => {
          return (
            value.dateValue.hours > this.appDate.hours ||
            (value.dateValue.hours === this.appDate.hours &&
              value.dateValue.minutes >= this.appDate.minutes)
          );
        });

        if (a.length !== 0)
          this.clockEvent = [...a, ...this.clockEvent.slice(0, -a.length)];
      },
      removeClock(index) {
        this.clockEvent.splice(index, 1);
      },
      //   saveCountdownDay() {
      //     this.save("CountdownDay", this.CountdownDay);
      //   },
      //   loadCountdownDay() {
      //     let CountdownDay = JSON.parse(localStorage.getItem("CountdownDay"));
      //     if (CountdownDay) {
      //       this.CountdownDay = CountdownDay;
      //     }
      //   },
      addCustomComponents(value) {
        if (this.customComponents.includes(value) !== false) return;
        this.customComponents.push(value);
      },
    },
  },
  {}
);

