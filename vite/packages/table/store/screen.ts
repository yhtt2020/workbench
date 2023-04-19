import {defineStore} from "pinia";
import dbStorage from "./dbStorage";
const tips={
  zoom: {
    status: true,
    content: '说明：缩放设置是每个分屏默认独立的。部分功能仅可在主屏使用。'
  },
  wallpaper: {
    status: true,
    content: '壁纸功能需要到达等级之后方可解锁全部功能。'
  }
}
export const screenStore = defineStore('screen', {
  state: () => ({
    screens: [{
      title: '主屏',
      key: 'main',
      closable: false,

    }],
    tips: tips,
    currentTip: 'zoom'

  })
  ,
  actions: {
    reset() {
      this.screens = [{
        title: '主屏',
        key: 'main',
        closable: false,
      }]
    },
    resetTips(){
      this.tips=tips
    }
  },
  persist: {
    enabled: true,
    strategies: [{
      storage: dbStorage,
    }]
  }

})
