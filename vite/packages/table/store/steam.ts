import {defineStore} from "pinia";
import dbStorage from "./dbStorage";
// @ts-ignore
export const steamStore = defineStore('steam', {
  state: () => ({
    gameData:[], // 获取所有数据
    randomData:[], // 随机获取steam的优惠数据
  }),
  actions: {
    getGameOffers(value: any){
      this.gameData = value
    }
  },
  persist: {
    enabled: true,
    strategies: [{
      // 自定义存储的 key，默认是 store.$id
      // 可以指定任何 extends Storage 的实例，默认是 sessionStorage
      storage: dbStorage,
      // state 中的字段名，按组打包储存
    }]
  }
})