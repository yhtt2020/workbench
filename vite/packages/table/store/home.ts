import {defineStore} from "pinia";
import dbStorage from "./dbStorage";

// @ts-ignore
export const homeStore = defineStore(
  "homeStore",
  {
    state: () => {
      return {
        currentDeskId:'',//当前桌面的deskId
        currentDeskIndex: {},
      }
    },
    persist: {
      enabled: true,
      strategies: [{
        // 自定义存储的 key，默认是 store.$id
        // 可以指定任何 extends Storage 的实例，默认是 sessionStorage
        paths: [ 'currentDeskIndex', 'currentDeskId'],
        storage: dbStorage,
        // state 中的字段名，按组打包储存
      }]
    }
  }
);
