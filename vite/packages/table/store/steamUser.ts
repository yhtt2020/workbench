import {defineStore} from "pinia";
import dbStorage from "./dbStorage";
import {compareTime, randomData, sendRequest} from '../js/axios/api'
import {nanoid} from "nanoid";

// @ts-ignore
export const steamUserStore = defineStore("steamUser", {
  state: () => ({
    desks: [{
      name: '主桌面',
      nanoid: nanoid(4),
      cards: [],
      settings: {}
     }
    ],

    steamLoginData: {
      accessToken: '',
      refreshToken: '',
      webCookies: ''
    },
    userData: {},
    gameList: [],
    myGameList: []
  }),
  actions: {
    setSteamLoginData(value) {
      this.steamLoginData = {...this.steamLoginData, ...value}
    },
    setUserData(value) {
      this.userData = {...value}
    },
    setGameList(value) {
      this.gameList = value
    },
    addGameDetail(value) {
      value.forEach((e) => {
        const obj = this.gameList.find(i => i.appid == e.appinfo.appid)
        if (obj) {
          e.time = obj
        }
      })
      this.gameList = value
      this.gameList.sort((a, b) => {
        if (a.time === undefined && a.time === undefined) {
          return 0;
        } else if (a.time === undefined) {
          return 1;
        } else if (b.time === undefined) {
          return -1;
        } else if (a.time !== b.time) {
          return b.time.rtime_last_played - a.time.rtime_last_played;
        }
      });
      //   this.gameList.forEach((e,index) =>{
      //       const obj = value.find(i => i.appinfo.appid ==e.appid)
      //     if(obj){
      //       e.appinfo = obj.appinfo
      //       //console.log(e,obj)
      //      // e = {...e,...obj}
      //     }
      // })
    }
  },
  persist: {
    enabled: true,
    strategies: [{
      // 自定义存储的 key，默认是 store.$id
      // 可以指定任何 extends Storage 的实例，默认是 sessionStorage
      paths: ['steamLoginData', 'gameList', 'desks'],
      storage: dbStorage,
      // state 中的字段名，按组打包储存
    }]
  }
});
