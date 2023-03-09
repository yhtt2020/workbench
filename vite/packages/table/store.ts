import { defineStore } from "pinia";
import * as util from "util";
import { nanoid } from "nanoid";

// import _ from 'lodash-es';
// const {appModel, devAppModel} = window.$models

export const appStore = defineStore("appStore", {
  state: () => ({
    userInfo: false,

    apps: [],

    appData: {
      //应用数据
      weather: {
        cities: [],
      },
    },

    init: false, //todo 增加初始化设置的保存 是否初始设置过了

    fullScreen: false, //是否是全屏模式

    settings: {
      enableChat: true, //主界面显示聊天

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
      darkMod: true,
      attachScreen: null, //id,bounds
    },

    routeUpdateTime: Date.now(), //用于更新滚动条
    status: {
      music: {
        //存当前播放的音乐
        notInit: true,
        cover: "",
        title: "",
      },
    },
    decks: [
      {
        id: 1,
        title: "板子1",
        children: [
          {
            icon: "",
            cover: "",
            title: "微信",
          },
          {
            icon: "",
            cover: "",
            title: "微信",
          },
        ],
      },
      {
        id: 2,
        title: "板子1",
        children: [
          {
            icon: "",
            cover: "",
            title: "微信",
          },
          {
            icon: "",
            cover: "",
            title: "微信",
          },
          {
            icon: "",
            cover: "",
            title: "微信",
          },
        ],
      },
    ],
    CountdownDay: [],
    appDate: {},
    ClockEvent: [],
    customComponents: [],
  }),
  getters: {},

  actions: {
    save(key, value) {
      localStorage.setItem(key, JSON.stringify(value));
    },

    loadAll() {
      this.loadAppData();
      this.init = !!localStorage.getItem("init");
    },

    finishWizard() {
      this.init = true;
      localStorage.setItem("init", "true");
    },

    setMusic(status) {
      this.status.music = status;
      this.status.music.cover = status.cover.replace("34y34", "120y120"); //修正封面
      this.save("status.music", status);
    },

    loadMusic() {
      let music = JSON.parse(localStorage.getItem("status.music"));
      if (music) {
        this.status.music = music;
      }
    },
    loadAppData() {
      let saved = localStorage.getItem("appData.weather");
      if (saved) {
        let weather = JSON.parse(saved);
        console.log(weather);
        this.appData.weather = weather;
      }
      this.loadMusic();
      //    this.loadCountdownDay();
    },
    addApps(apps) {
      this.apps = this.apps.concat(apps);
    },

    addCity(city) {
      this.appData.weather.cities.push(city);
      this.saveWeather();
    },
    saveWeather() {
      this.save("appData.weather", this.appData.weather);
    },
    removeCity(cityId) {
      this.appData.weather.cities = this.appData.weather.cities.filter(
        (city) => {
          return city.id !== cityId;
        }
      );
      this.saveWeather();
    },
    setUser(userInfo) {
      userInfo.onlineGradeExtra.cumulativeMinutes =
        userInfo.onlineGradeExtra.cumulativeHours % 60;
      userInfo.onlineGradeExtra.cumulativeMinute =
        userInfo.onlineGradeExtra.minutes;
      userInfo.onlineGradeIcons = {};
      userInfo.onlineGradeIcons.crown = [];
      userInfo.onlineGradeIcons.sun = [];
      userInfo.onlineGradeIcons.moon = [];
      userInfo.onlineGradeIcons.star = [];
      function handleGrade(name) {
        for (let i = 0; i < userInfo.onlineGrade[name]; i++) {
          userInfo.onlineGradeIcons[name].push({
            icon:
              "file://" +
              window.globalArgs["app-path"] +
              `/icons/grade/${name}.svg`,
          });
        }
      }
      console.log(userInfo);

      Object.keys(userInfo.onlineGrade).forEach((v) => handleGrade(v));
      this.userInfo = userInfo;
    },
    setAppDate(value) {
      this.appDate = value;
    },

    addCountdownDay(value) {
      this.CountdownDay.push(value);

      //   this.saveCountdownDay();
    },
    removeCountdownDay(index) {
      this.CountdownDay.splice(index, 1);
    },
    addClock(value) {
      this.ClockEvent.push(value);
      this.sortClock();
    },
    sortClock() {
      console.log(this.ClockEvent[0]);
      //console.log(this.appDate.minutes);
      console.log(this.appDate.hours);
      this.ClockEvent.sort((v1, v2) => {
        let value1 = v1.DateValue;
        let value2 = v2.DateValue;
        if (value1.hours === value2.hours) {
          return value1.minutes - value2.minutes;
        }
        return value1.hours - value2.hours;
      });
      const a = this.ClockEvent.filter((value) => {
        return (
          value.DateValue.hours > this.appDate.hours ||
          (value.DateValue.hours === this.appDate.hours &&
            value.DateValue.minutes >= this.appDate.minutes)
        );
      });

      if (a.length !== 0)
        this.ClockEvent = [...a, ...this.ClockEvent.slice(0, -a.length)];
    },
    removeClock(index) {
      this.ClockEvent.splice(index, 1);
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
});
