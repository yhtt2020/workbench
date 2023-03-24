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

      lockTimeout: 1800, //锁屏延迟，默认改为半小时

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
        customComponents: [{name:'Music',id:2},{name:'Weather',id:3},{name:'Timer',id:4},{name:'Stock',id:5}],
        aidaData:null,

      };
    },

    actions: {
      setAidaData(value){
        this.aidaData = value;
      },
      setAppDate(value) {
        this.appDate = value;

      },

      addCountdownDay(value) {
        this.countdownDay.push(value);
        console.log(this.countdownDay)
        this.sortCountdown()
        //   this.saveCountdownDay();
      },
      sortCountdown() {
        this.countdownDay.sort((v1, v2) => {
          let value1 = v1.dateValue;
          let value2 = v2.dateValue;
          if (value1.year === value2.year) {
            if(value1.month === value2.month)return value1.day - value2.day;
            return value1.month - value2.month;
          }
          return value1.year - value2.year;
        });
        const a = this.countdownDay.filter((value) => {
          return (
            value.dateValue.year > this.appDate.year ||
            (value.dateValue.year === this.appDate.year &&
              value.dateValue.month >= this.appDate.month)|| (value.dateValue.year === this.appDate.year &&
              value.dateValue.day >= this.appDate.day&&value.dateValue.month === this.appDate.month)
          );
        });

        if (a.length !== 0)
          this.countdownDay = [...a, ...this.countdownDay.slice(0, -a.countdownDay)];
      },
      removeCountdownDay(index) {
        this.countdownDay.splice(index, 1);
      },
      addClock(value) {
        this.clockEvent.push(value);
        // if(this.clockEvent[this.clockEvent.length-1].clockType==='每天'&&this.clockEvent[this.clockEvent.length-1].dateValue.dateValue.hours===this.appDate.hours&&
        //   this.clockEvent[this.clockEvent.length-1].dateValue.dateValue.minutes===this.appDate.minutes){
        //   this.everySortClock()
        // }else{
          this.sortClock();
        console.log( this.clockEvent)
        //}

      },
      sortClock() {
        for (let i = 0; i < this.clockEvent.length; i++) {
          if(this.clockEvent[i].dateValue.hours !== this.appDate.hours &&this.clockEvent[i].flag===true||
            this.clockEvent[i].dateValue.minutes !== this.appDate.minutes&&this.clockEvent[i].flag===true)
            this.clockEvent[i].flag=undefined;
        }
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
            (value.dateValue.hours > this.appDate.hours) ||
            (value.dateValue.hours === this.appDate.hours &&
              value.dateValue.minutes >= this.appDate.minutes)
          );
        });
      const b = this.clockEvent.filter((value) => {
        return (value.flag===true);
      });
if(a.length!==0)
          this.clockEvent = [...a, ...this.clockEvent.slice(0, -a.length)];
        for (let i = 0; i < b.length; i++) {
        let e = this.clockEvent.shift()
          this.clockEvent.push(e)
        }

      },
      removeClock(index,n) {
        console.log(this.clockEvent)
            if (this.clockEvent[0].clockType!=='每天'||n===1)
            {
              this.clockEvent.splice(index, 1);
            }
            else{
              const a = this.clockEvent.shift()
              a.flag = true;
              this.sortClock()
              this.clockEvent.push(a)

            }

      },
      addCustomComponents(value) {
        //if (this.customComponents.includes(value)) return;
        console.log(value)
        this.customComponents.push(value);
      },
      removeCustomComponents(customIndex) {
        console.log(customIndex)
        this.customComponents.splice( this.customComponents.findIndex(item=>{
          return item.id===customIndex
        }),1)
        // this.customComponents.splice(customIndex,1);

      },


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
  },

  {}
);
export const countDownStore = defineStore(
  "countDownStore",
  {
    state: () => {
      return{
        countDowndate:0,
        hours:0,
        minutes:0,
        seconds:0,
        countDowntime:{},
        timer:null,
        countDownBtn:false
      }

    },

    actions: {
    setCountDown(value){
      this.hours = value.hours;
      this.minutes = value.minutes;
      this.seconds = value.seconds;
      this.countDowndate = this.hours*3600000+this.minutes*60000+this.seconds*1000
      this.regularTime();
      this.timer&&clearInterval(this.timer);
       this.timer = setInterval(this.regularTime,1000)
      this.countDownBtn = false
    },
      stopCountDown(){
       clearInterval(this.timer);
       this.countDownBtn=true
      },
      regularTime(){
        if(this.countDowndate<0){this.dCountDown()
          return;}
        let h = parseInt(this.countDowndate / 1000 / 60 / 60 % 24)
        let m = parseInt( this.countDowndate / 1000 / 60 % 60)
        let s = parseInt( this.countDowndate / 1000 % 60)

        if(h<10){
          this.countDowntime.hours = '0' + String(h)
        }else {
          this.countDowntime.hours = h
        }
        if (m < 10) {
          this.countDowntime.minutes = "0" + String(m);
        } else {
          this.countDowntime.minutes = m;
        }
        if (s < 10) {
          this.countDowntime.seconds = "0" + String(s);
        } else {
          this.countDowntime.seconds = s;
        }
        this.countDowndate -=1000;
      },
      openCountDown(){

        this.timer&&clearInterval(this.timer);
        this.timer = setInterval(this.regularTime,1000);
        this.countDownBtn=false;
      },
      dCountDown(){
        this.timer&&clearInterval(this.timer);
        this.countDowntime={};
      }
    },
  },

  {}
);


