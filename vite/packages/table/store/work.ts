import {defineStore} from "pinia";
import dbStorage from "./dbStorage";

// @ts-ignore
export const workStore = defineStore('work', {
  state: () => ({
    deskList: [],//桌面
  }),
  actions: {},
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
