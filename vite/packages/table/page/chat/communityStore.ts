// 社群缓存
import {defineStore} from "pinia";
import dbStorage from "../../store/dbStorage";

// @ts-ignore
export const communityStore = defineStore('communions',{
  state:()=>({

  }),

  actions:{

  },

  persist:{
   enabled: true,
    strategies: [{
      // 自定义存储的 key，默认是 store.$id
      // 可以指定任何 extends Storage 的实例，默认是 sessionStorage
      storage: dbStorage,
      paths: []
      // state 中的字段名，按组打包储存
    }]
  }
  
})