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
const getChannelTree = sUrl("/app/community/channel/getTreeList") // 获取树状频道
const createChannels = sUrl("/app/community/channel/create") // 创建社群频道


// @ts-ignore
export const communityStore = defineStore('community',{
  state: () => ({
    communityList:[], // 接收社群
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
    if(res !== null &&  res.data && res.data.list){
      const deduplicateData = res.data.list.filter((item:any) => { 
        return item.hasOwnProperty('communityInfo')
      })
      this.communityList = deduplicateData
    }
   },

   // 申请加入社群
   async joinCommunity(option:any){
    return await post(applyJoin,option)
   },

   // 获取推荐社群
   async getRecommendCommunityList(){
    const res = await post(getRecommendCommunity,{})
    this.recommendCommunityList = res.data
   },

   // 搜索社群
   async searchCommendCommunity(val:any){
    return await post(searchRecommendCommunity,{keywords:val})
   },

   //  创建社群频道
   async createChannel(data:any){
    return await post(createChannels,data)
   },
  
   

   // 获取社群频道列表
   async getChannel(data){
    return await post(getChannelList,data)
   },


   // 获取树状判断列表
   async getTreeChannelList(data){
    return await post(getChannelTree,data)
   },
   

 

  },

  persist:{
    enabled: true,
    strategies: [{
      // 自定义存储的 key，默认是 store.$id
      // 可以指定任何 extends Storage 的实例，默认是 sessionStorage
      storage: dbStorage,
      paths: ['myCommunityList','recommendCommunityList','channelData']
      // state 中的字段名，按组打包储存
    }]
  }
});
