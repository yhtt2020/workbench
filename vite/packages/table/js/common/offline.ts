import {defineStore} from "pinia";
import dbStorage from "../../store/dbStorage";
import {mapActions, mapState,mapWritableState} from "pinia";
// @ts-ignore
export const offlineStore = defineStore("offlineStore", {
  state: () => ({
    isOffline:false,
  }),
  getters:{
    getIsOff(){
      return this.isOffline
    }
  },
  actions: {
    isOff(){
      // console.log(this.isOffline);
      // setTimeout(()=>{
      //   console.log(100,this.isOffline);
      // },100)
      // setTimeout(()=>{
      //   console.log(200,this.isOffline);
      // },200)
      // setTimeout(()=>{
      //   console.log(300,this.isOffline);
      // },300)
      
      return this.isOffline
    }




  },
  persist: {
    enabled: true,
    strategies: [{
      // 自定义存储的 key，默认是 store.$id
      // 可以指定任何 extends Storage 的实例，默认是 sessionStorage
      storage: dbStorage,
      paths: ['isOffline']
      // state 中的字段名，按组打包储存
    }]
  }
})
