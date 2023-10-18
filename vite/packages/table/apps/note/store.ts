import {defineStore} from "pinia";
import dbStorage from "../../store/dbStorage";
import cache from "../../components/card/hooks/cache";
// import { cardStore } from '../../../store/card';
import { cardStore } from '../../store/card';
import {mapActions, mapState,mapWritableState} from "pinia";
import { useToast } from "vue-toastification";
const toast = useToast()
// @ts-ignore
export const noteStore = defineStore("noteStore", {
  state: () => ({
    // 测试数据
    noteList:[
      {
        title:'今日事今日毕',
        content:'今日事今日毕今日事今日毕今日事今日毕今日事今日毕今日事今日毕今日事今日毕今日事今日毕今日事今日毕今日事今日毕今日事今日毕',
        time:'十分钟前',
        desk:'日常桌面',
        backgroundColor:"linear-gradient(-45deg, #545454 0%, #C1E65B 0%, #71E293 100%)",
      },
      {
        title:'今日事今日毕',
        content:'今日事今日毕',
        time:'十分钟前',
        desk:'日常桌面',
        backgroundColor:"linear-gradient(-45deg, #545454 0%, #51E191 0%, #42CAAB 100%)",
      },
      {
        title:'今日事今日毕',
        content:'今日事今日毕',
        time:'十分钟前',
        desk:'日常桌面',
        backgroundColor:"linear-gradient(-45deg, #545454 0%, #FDE485 0%, #F895AA 100%)",
      },
      {
        title:'今日事今日毕',
        content:'今日事今日毕',
        time:'十分钟前',
        desk:'日常桌面',
        backgroundColor:"linear-gradient(-45deg, #545454 0%, #C1E65B 0%, #71E293 100%)",
      },
      {
        title:'今日事今日毕',
        content:'今日事今日毕',
        time:'十分钟前',
        desk:'日常桌面',
        backgroundColor:"linear-gradient(-45deg, #545454 0%, #C1E65B 0%, #71E293 100%)",
      },
      {
        title:'今日事今日毕',
        content:'今日事今日毕',
        time:'十分钟前',
        desk:'日常桌面',
        backgroundColor:"linear-gradient(-45deg, #545454 0%, #C1E65B 0%, #71E293 100%)",
      },
      {
        title:'今日事今日毕',
        content:'今日事今日毕',
        time:'十分钟前',
        desk:'日常桌面',
        backgroundColor:"linear-gradient(-45deg, #545454 0%, #C1E65B 0%, #71E293 100%)",
      },
      {
        title:'今日事今日毕',
        content:'今日事今日毕',
        time:'十分钟前',
        desk:'日常桌面',
        backgroundColor:"linear-gradient(-45deg, #545454 0%, #C1E65B 0%, #71E293 100%)",
      },
      {
        title:'今日事今日毕',
        content:'今日事今日毕',
        time:'十分钟前',
        desk:'日常桌面',
        backgroundColor:"linear-gradient(-45deg, #545454 0%, #C1E65B 0%, #71E293 100%)",
      },
    ],
    // 主应用里当前选中
    selNote:-1,
    // 背景色
    noteBgColor:[
      "linear-gradient(-33deg, #545454 0%, #AC9555 1%, #A3625D 100%)",
      "linear-gradient(-53deg, #545454 0%, #ACA955 1%, #A3865D 100%)",
      "linear-gradient(-33deg, #545454 0%, #90AC55 1%, #5DA36D 100%)",
      "linear-gradient(-53deg, #545454 0%, #5564AC 1%, #7E5DA3 100%)",
      "linear-gradient(-64deg, #545454 0%, #55A2AC 1%, #5D7BA3 100%)",
      // "linear-gradient(-64deg, #545454 0%, #55A2AC 1%, #5D7BA3 100%)",
    ],
    // 桌面测试数据
    noteDesk:[
      {

      }
    ],
    
  }),
  // getters:{},
  actions: {
    ...mapActions(cardStore, ['updateCustomData']),


    // 添加番茄
    addTomatoNum(){
      // 计算今日剩余时间
      let remainingTime = this.getMainingTime;
      this.tomatoNum++
      this.tomatoList[new Date().getDay()] = this.tomatoNum;
      // 这个数据今天会过期，用于保存今日番茄
      cache.set("tomatoNum",this.tomatoNum,remainingTime)
      cache.set("tomatoList",this.tomatoList,remainingTime + (6-new Date().getDay())*24*60*60*1000)
      this.countTime(this.tomatoList)
      this.max(this.tomatoList)
    },

  },
  persist: {
    enabled: true,
    strategies: [{
      // 自定义存储的 key，默认是 store.$id
      // 可以指定任何 extends Storage 的实例，默认是 sessionStorage
      storage: dbStorage,
      paths: ['noteList']
      // state 中的字段名，按组打包储存
    }]
  }
})
