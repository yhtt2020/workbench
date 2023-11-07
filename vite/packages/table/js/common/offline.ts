import {defineStore} from "pinia";
import dbStorage from "../../store/dbStorage";
import {mapActions, mapState,mapWritableState} from "pinia";
import cache from "../../components/card/hooks/cache";
// @ts-ignore
export const offlineStore = defineStore("offlineStore", {
  state: () => ({
    isOffline:false,
    offlineList:['weather','OilPrices','supervisory','news','todo','games','GameEpic','historyInfo','smallRank','gameInformation','Dashboard','ShortTodo','Guider','ShortChart','yuanCommunity']

  }),
  getters:{},
  actions: {
    changeOffline(){
      cache.set('isOffline',this.isOffline)
      // console.log(cache.get('isOffline'));
    },
    getIsOffline(){
      // console.log(cache.get('isOffline'));
      return cache.get('isOffline')
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
