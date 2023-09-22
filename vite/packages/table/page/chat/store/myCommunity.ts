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
    this.recommendCommunityList = res.data
   },

   // 搜索社群
   async searchCommendCommunity(val:any){
    return await post(searchRecommendCommunity,{keywords:val})
   },

   // 获取社群频道列表
   async getChannel(data){
    const res =  await post(getChannelList,data)
    if(res.data && res.data.list.length !== 0){
      console.log('获取频道数据',res.data.list)
      const serialList =  this.serializeData(res.data.list)
      console.log('序列化后的数据',serialList)
    }
    

   },

   // 获取树状判断列表
   async getTreeChannelList(data){
    const res = await post(getChannelTree,data)
    console.log('获取树状列表',res);
    
   },

   // 创建社群频道
   async createChannel(data:any){
    // console.log('排查参数::>>',data)
    return await post(createChannels,data)
   },

   /**
    * 将创建的频道数据返回进行序列化
    * **/
   serializeData(data){
    const map = data.reduce((acc, obj) => {
      acc[obj.id] = { ...obj, children: [] };
      return acc;
    }, {});
  
    const tree = [];
  
    data.forEach(obj => {
      // if (obj.parentId !== null) {
      //   console.log('排查问题::>>',map[obj.parentId])
      //   // map[obj.parentId].children.push(map[obj.id]);
      // } else {
      //   console.log('排查问题2::>>',map[obj.parentId])
      //   // tree.push(map[obj.id]);
      // }
    });
    console.log('获取树状数据',tree)
  
    return tree;
    

    // const result = []
    // data.forEach(item=>{
    //   if(item.role === role && item.parentId === parentId){
    //     const children = this.serializeData(data, role = 'channel',parentId = 2);
    //     console.log('获取数据',children);
        
    //   }
    //   // if(item.parentId === 1 && item.type === 'category' && item.role === 'category'){
    //   //   // const lastItem = {
    //   //   //   ...item,
    //   //   //   children:null,
    //   //   // }
    //   //   // for (let i = 0; i < data.length; i++) {
    //   //   //   if(data[i].type === 'channel' && item.role === 'channel'){
    //   //   //     console.log('频道',data[i]);
    //   //   //   }
    //   //   // }

        
    //   // //  const children = this.serializeData(data, role = 'channel');
    //   // //  console.log('排查children',children);
    //   // //  if (children.length) {
    //   // //   item.children = children;
    //   // //  }
    //   // //  result.push(item);
    //   // }
    // })
    // // return result;
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
