import {defineStore} from "pinia";
import dbStorage from "./dbStorage";
import {compareTime, randomData, sendRequest} from '../js/axios/api'

// @ts-ignore
export const steamUserStore = defineStore("steam", {
  state: () => ({
    steamLoginData: {
      accessToken: '',
      refreshToken: '',
      webCookies: ''
    },
    userData:{
    }
  }),
  actions: {
    setSteamLoginData(value) {
      this.steamLoginData = {...this.steamLoginData,...value}
    },
    setUserData(value){
      this.userData = {...value}
    }
  },
  persist: {
    enabled: true,
    strategies: [{
      // 自定义存储的 key，默认是 store.$id
      // 可以指定任何 extends Storage 的实例，默认是 sessionStorage
      paths: ['steamLoginData'],
      storage: localStorage,
      // state 中的字段名，按组打包储存
    }]
  }
});
