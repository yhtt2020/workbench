import { defineStore } from "pinia";
import dbStorage from "../../../store/dbStorage";
import { sUrl } from "../../../consts";
import { post, postMock } from "../../../js/axios/request";
import { serverCache, localCache } from "../../../js/axios/serverCache";

const createCommunity = sUrl("/app/community/create");
const getMyCommunity = sUrl("/app/community/my")

// @ts-ignore
export const myCommunityStore = defineStore('myCommunity',{
  state: () => ({
    myCommunityList:[], // 接收我的社群
  }),

  actions: {
   // 创建社群
   async createCommunity(option: any) {
    return await post(createCommunity, option);
   },
   
   // 获取我的社群
   async getMyCommunity(){
    const res = await post(getMyCommunity,{})
    localCache.set('list',res.data.list,20*60)
    // const resData = localCache.get('list')
    // console.log('获取我的社群',localCache.get('list'));
    this.myCommunityList = localCache.get('list')
    
   }


  },

  persist:{
    enabled: true,
    strategies: [{
      // 自定义存储的 key，默认是 store.$id
      // 可以指定任何 extends Storage 的实例，默认是 sessionStorage
      storage: dbStorage,
      paths: ['myCommunityList']
      // state 中的字段名，按组打包储存
    }]
  }
});
