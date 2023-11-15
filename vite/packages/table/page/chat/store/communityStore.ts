import {defineStore} from "pinia";
import dbStorage from "../../../store/dbStorage";
import {sUrl} from "../../../consts";
import {post} from "../../../js/axios/request";
import { chatList } from '../../../js/data/chatList'

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
    categoryClass:[],
    channelList:[],
  }),

  actions: {
   // 创建社群
   async createCommunity(option: any) {
    return await post(createCommunity, option);
   },

   // 获取我的社群
   async getMyCommunity(){
    let res = await post(getMyCommunity,{})
    // console.log('查看返回数据',res);
    
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
   async createChannel(data:any,no:any){
    // console.log('查看data和no',data,no);
    const res = await post(createChannels,data)
    // console.log('查看频道添加成功结果',res);
    if(res.status === 1 && no !== 1){
      this.getCategoryData(no)
      this.getChannelList(no)
    }
   },

   // 获取社群频道目录
   async getCategoryData(id:any){

    // console.log('获取数值',id,)

    if(!isNaN(parseInt(id))){
      const option = { communityNo:parseInt(id), cache:1 }
      const categoryResList = await post(getChannelList,option)
      const categoryTreeList = await post(getChannelTree,option)
      const communityName = this.communityList?.find((item:any)=>{
        return String(item.communityInfo.no) === String(id)
      })
      const result = {
        name:communityName?.communityInfo?.name,
        role:communityName?.role,
        no:communityName?.communityInfo?.no,
        tree:categoryTreeList?.data?.treeList,
        category:categoryResList?.data?.list,
        summary:communityName?.summary
      }

      // console.log('查看数据',result)

      this.categoryList = result

    }
   
   },


   // 获取频道数据
   async getChannelList(id:any){
    if(!isNaN(parseInt(id))){
      const option = { communityNo:parseInt(id), cache:1 }
      const res =  await post(getChannelList,option)
      // console.log('排查数据',res)
      if(res?.data?.list){
        const filterCategoryRes = res?.data?.list.filter((item:any)=>{
         return item.role === 'category'
        })

        const filterTypeChannel = res?.data?.list.filter((item:any)=>{
         return item.role === 'channel'
        })
        // console.log('排查过滤后的有子级目录数据',filterCategoryRes)
        // console.log('排查过滤后的没有子级目录数据',filterTypeChannel)

        this.categoryClass  = filterCategoryRes
        this.channelList = filterTypeChannel
      }

      // const filterCategoryRes = res?.data?.list.filter((item:any)=>{
      //   return item.role === 'category'
      // })

      // const filterTypeChannel = res?.data?.list.filter((item:any)=>{
      //   return item.role === 'channel'
      // })


      // // console.log('排查过滤后的数据',filterCategoryRes)

      // if(filterCategoryRes?.length !== 0 && filterTypeChannel?.length !== 0){
        // this.categoryClass  = filterCategoryRes
        // this.channelList = filterTypeChannel
      // }

    }
   },

   // 更新社群频道
   async updateChannel(data:any){
     return  await  post(sUrl("/app/community/channel/updateProfile"),data)
   },

   // 替换数组
   updateCategoryClass(val:any){
    this.categoryClass = val
   },
 

   // 删除社群频道
   async removeCategory(id:any,no:any){
    const res = await post(deleteCategory,{id:id})
    // console.log('查看结果',res);
    if(res.status === 1 && no !== 1){
      this.getCategoryData(no)
      this.getChannelList(no)
    }
   }




  },

  persist:{
    enabled: true,
    strategies: [{
      // 自定义存储的 key，默认是 store.$id
      // 可以指定任何 extends Storage 的实例，默认是 sessionStorage
      storage: dbStorage,
      paths: ['myCommunityList','recommendCommunityList','categoryList','categoryClass']
      // state 中的字段名，按组打包储存
    }]
  }
});
