import {defineStore} from "pinia";
import dbStorage from "../../../store/dbStorage";
import {sUrl} from "../../../consts";
import {post} from "../../../js/axios/request";

const createCommunity = sUrl("/app/community/create"); // 创建社群
const getMyCommunity = sUrl("/app/community/my")  // 我的社群
const getRecommendCommunity = sUrl("/app/community/getRecommendList") // 获取推荐社群
const applyJoin = sUrl("/app/community/join") // 申请加入社群
const searchRecommendCommunity = sUrl("/app/community/searchCommunity") // 搜索
const getChannelList = sUrl("/app/community/channel/getList") // 获取频道列表
const getChannelTree = sUrl("/app/community/channel/getTreeList") // 获取树状频道
const createChannels = sUrl("/app/community/channel/create") // 创建社群频道
const deleteCategory = sUrl("/app/community/channel/remove") // 删除社群频道

// @ts-ignore
export const communityStore = defineStore('communityStore',{
  state: () => ({
    communityList:[], // 接收社群
    recommendCommunityList:[], // 存储推荐社群
    categoryList:{}, // 频道目录列表
  }),

  actions: {
   // 创建社群
   async createCommunity(option: any) {
    return await post(createCommunity, option);
   },

   // 获取我的社群
   async getMyCommunity(){
    let res = await post(getMyCommunity,{})
    if(res?.data?.list){
      this.communityList = res.data.list.filter((item: any) => {
        return item.hasOwnProperty('communityInfo')
      })
    }
   },

   // 申请加入社群
   async joinCommunity(option:any){
    return await post(applyJoin,option)
   },

   // 获取推荐社群
   async getRecommendCommunityList(){
    const res = await post(getRecommendCommunity,{})
    if(res?.data){
      this.recommendCommunityList = res.data
    }
   },

   // 搜索社群
   async searchCommendCommunity(val:any){
    return await post(searchRecommendCommunity,{keywords:val})
   },

   //  创建社群频道
   async createChannel(data:any){
    return await post(createChannels,data)
   },

   // 获取社群频道目录
   async getCategoryData(id:any){
    const option = {
      communityNo:id,
      cache:1
    }
    const categoryList = await post(getChannelList,option)
    return categoryList
   },

   // 获取频道树状列表
   async getCategoryTreeData(id:any){
    const option = {
      communityNo:id,
      cache:1
    }
    const categoryTreeList = await post(getChannelTree,option)
    return categoryTreeList
   },


   // 删除社群频道
   async removeCategory(id:any){
    return post(deleteCategory,{id:id})
   }




  },

  persist:{
    enabled: true,
    strategies: [{
      // 自定义存储的 key，默认是 store.$id
      // 可以指定任何 extends Storage 的实例，默认是 sessionStorage
      storage: dbStorage,
      paths: ['myCommunityList','recommendCommunityList','categoryList']
      // state 中的字段名，按组打包储存
    }]
  }
});
