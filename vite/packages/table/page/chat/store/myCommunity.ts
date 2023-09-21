import { defineStore } from "pinia";
import dbStorage from "../../../store/dbStorage";
import { sUrl } from "../../../consts";
import { post, postMock } from "../../../js/axios/request";
import { serverCache, localCache } from "../../../js/axios/serverCache";
import _ from 'lodash-es'

const createCommunity = sUrl("/app/community/create"); // 创建社群
const getMyCommunity = sUrl("/app/community/my")  // 我的社群
const getRecommendCommunity = sUrl("/app/community/getRecommendList") // 获取推荐社群
const applyJoin = sUrl("/app/community/join") // 申请加入社群
const searchRecommendCommunity = sUrl("/app/community/searchCommunity") // 搜索
const getChannelList = sUrl("/app/community/channel/getList") // 获取频道列表
const createChannels = sUrl("/app/community/channel/create") // 创建社群频道

// @ts-ignore
export const myCommunityStore = defineStore('myCommunity',{
  state: () => ({
    myCommunityList:[], // 接收我的社群
    recommendCommunityList:[], // 存储推荐社群
  }),

  actions: {
   // 创建社群
   async createCommunity(option: any) {
    return await post(createCommunity, option);
   },
   
   // 获取我的社群
   async getMyCommunity(){
    const res = await post(getMyCommunity,{})
    const list = res.data.list
    const index = _.filter(list,function(o:any){ 
      if('communityInfo' in o){
        return o
      }
    })
    console.log('获取数据',index);
    localCache.set('list',index,20*60)
    this.myCommunityList = localCache.get('list')
   },

   // 申请加入社群
   async joinCommunity(option:any){
    return await post(applyJoin,option)
   },

   // 获取推荐社群
   async getRecommendCommunityList(){
    const res = await post(getRecommendCommunity,{})
    localCache.set('recommendList',res.data,10*60)
    this.recommendCommunityList =  localCache.get('recommendList')
   },

   // 搜索社群
   async searchCommendCommunity(val:any){
    return await post(searchRecommendCommunity,{keywords:val})
   },

   // 获取社群频道列表
   async getChannel(data:any){
    return await post(getChannelList,data)
   },

   // 创建社群频道
   async createChannel(data:any){
    return await post(createChannels,data)
   }

  },

  persist:{
    enabled: true,
    strategies: [{
      // 自定义存储的 key，默认是 store.$id
      // 可以指定任何 extends Storage 的实例，默认是 sessionStorage
      storage: dbStorage,
      paths: ['myCommunityList','recommendCommunityList']
      // state 中的字段名，按组打包储存
    }]
  }
});
