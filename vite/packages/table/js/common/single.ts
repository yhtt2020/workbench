import {defineStore} from "pinia";
import dbStorage from "../../store/dbStorage";
import {mapActions, mapState,mapWritableState} from "pinia";
import cache from "../../components/card/hooks/cache";
import { appStore } from "../../store";
// @ts-ignore
export const singleStore = defineStore("singleStore", {
  state: () => ({
    // 修改打开离线模式
    // isOffline:false,
    
    singleList:['weather','OilPrices','news','historyInfo','smallRank','gameInformation','yuanCommunity','signIn','Courier'],
    // 屏蔽导航栏
    navList:['chat', 'market'],
    // 屏蔽轻应用
    appList:['应用市场','元社区'],


  }),
  getters:{},
  actions: {
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
