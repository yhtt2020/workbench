import {defineStore} from "pinia";
import dbStorage from "../../../store/dbStorage";
import cache from "../../../components/card/hooks/cache";
import { cardStore } from '../../../store/card';
import {mapActions, mapState,mapWritableState} from "pinia";
import { useToast } from "vue-toastification";
import { post } from "../../../js/axios/request"
const toast = useToast()
// @ts-ignore
export const shortTalkStore = defineStore("shortTalkStore", {
  state: () => ({
    // 密钥
    access_token:'cd72cb58e42ab9c15a55882e5c71e6d5',
    // 请求地址
    baseUrl:'https://osxbenew.mark.opensns.cn',
    // 社区访问数据 含平台
    access:{},
    // 社区互动数据
    interact:{},


  }),    
  // getters:{},
  actions: {
    // 处理请求地址
    qUrl(url){
      return this.baseUrl + url
    },
    
    // 初始化 请求数据
    async getData(customData){
      // console.log(customData);
      // console.log(customData.customData.defaultPlatType);
      
      await post( this.qUrl('/oauth/authorization/getCensus')+"?access_token=" + this.access_token,{
        "content":{
          "sign":"all_visit,week_thread,month_thread,all_thread,week_post,month_post,all_post,week_support,month_support,all_support,month_register,today_visit,week_visit,month_visit ,today_thread ,today_post,today_support,today_register,week_register,all_register,access,interact",
          "access":{
            "plate":customData.defaultPlatType.name,
            "day_type":customData.defaultTimeType.name,
            "start":customData.defaultTimeType.name == 'day'?this.getSevenDaysAgoTimestamp():customData.defaultTimeType.name=='week'?this.getSixWeeksAgoMondayTimestamp():this.getTwoMonthsAgoTimestamp(),
            "end":new Date().getTime()/1000
          },
            "interact":{
            "day_type":customData.defaultTimeType.name,
            "start":customData.defaultTimeType.name == 'day'?this.getSevenDaysAgoTimestamp():customData.defaultTimeType.name=='week'?this.getSixWeeksAgoMondayTimestamp():this.getTwoMonthsAgoTimestamp(),
            "end":new Date().getTime()/1000
          }
        }
        
      }).then((res)=>{
        // console.log(res)
        this.access = res.access
        this.interact = res.interact
      })
    },
    getSevenDaysAgoTimestamp() {
      var currentDate = new Date();
      currentDate.setDate(currentDate.getDate() - 7);
      currentDate.setHours(0, 0, 0, 0);
      return Math.floor(currentDate.getTime() / 1000);
    },
    getOneMonthAgoTimestamp() {
      var currentDate = new Date();
      currentDate.setUTCMonth(currentDate.getUTCMonth() - 1);
      currentDate.setUTCDate(1);
      currentDate.setUTCHours(0, 0, 0, 0);
      return Math.floor(currentDate.getTime() / 1000);
    },
    getSixWeeksAgoMondayTimestamp() {
      var currentDate = new Date();
      currentDate.setDate(currentDate.getDate() - (6 * 7 + (currentDate.getDay() + 6) % 7));
      currentDate.setHours(0, 0, 0, 0);
      return Math.floor(currentDate.getTime() / 1000);
    },

  
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
