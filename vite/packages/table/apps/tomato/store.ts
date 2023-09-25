import {defineStore} from "pinia";
import dbStorage from "../../store/dbStorage";


// @ts-ignore
export const tomatoStore = defineStore("tomatoStore", {
  state: () => ({
    aggList:{
      type:'work'
    },
    tomatoTimer1:{
      timer1:"tomatoTimer1421431"
    }

  }),
  actions: {

    // 番茄钟组件 时间
    getTomatoTimer(){
      return this.tomatoTimer1.timer1
    },
    setTomatoTimer(timer){
      this.tomatoTimer1.timer1 = "已更改"
    },



  },
  persist: {
    enabled: true,
    strategies: [{
      // 自定义存储的 key，默认是 store.$id
      // 可以指定任何 extends Storage 的实例，默认是 sessionStorage
      storage: dbStorage,
      paths: ['settings', 'items', 'totalRows', 'index']
      // state 中的字段名，按组打包储存
    }]
  }
})
