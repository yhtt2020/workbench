import {defineStore} from "pinia";
import dbStorage from "../../../store/dbStorage";
import cache from "../../../components/card/hooks/cache";
import { cardStore } from '../../../store/card';
import {mapActions, mapState,mapWritableState} from "pinia";
import { useToast } from "vue-toastification";
const toast = useToast()
// @ts-ignore
export const shortTalkStore = defineStore("shortTalkStore", {
  state: () => ({
    // aggList:{
    //   type:'work'
    // },
    
  }),
  // getters:{},
  actions: {
    // 初始化 请求数据
    
    
    

  },
  persist: {
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
