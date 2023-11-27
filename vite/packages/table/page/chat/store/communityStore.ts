import {defineStore} from "pinia";
import dbStorage from "../../../store/dbStorage";
import {sUrl} from "../../../consts";
import {post} from "../../../js/axios/request";
import { chatList } from '../../../js/data/chatList';
import _ from 'lodash-es';

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
    currentNo:""
  }),

  getters:{
    getCommunityDetail:(state)=>(no:any)=>{
      const isNull = state.communityList.length !== undefined && state.communityList.length !== 0;
      if(isNull){
        const list = state.communityList;
        const find = _.find(list,function(find:any){ return String(find.no) === String(no) });
        return find !== undefined ? find : {};
      }
    }
  },

  actions: {
   // 创建社群
   async createCommunity(option: any) {
    return await post(createCommunity, option);
   },

   // 获取我的社群
   async getMyCommunity(){
    post(getMyCommunity,{}).then(async (res)=>{
      const list = res?.data?.list;
      const mapList = list.map(async (item:any)=>{
        if(item.hasOwnProperty('communityInfo')){
          const data = item?.communityInfo;
          const communityNo = data.no;
          const itemRes = await this.getCategoryData(communityNo)
          const itemOption ={
            ...data,
            ...item,
            tree:itemRes.tree,
            summary:'',
            uid:item.uid,
            unreadTree:itemRes.unreadTree,
            unread:0,
            category:itemRes.category,
          };
          return itemOption;
        }
      });
      const results = await Promise.all(mapList);
      const filterUndefinedList = results.filter((item:any)=>{
        if(item !== undefined){
          return item;
        }
      });
      this.communityList = filterUndefinedList;
    });
   },

   // 申请加入社群
   async joinCommunity(option:any){
    return await post(applyJoin,option);
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
    const res = await post(createChannels,data)
    if(res.status === 1 && no !== 1){
      this.getMyCommunity()
      this.getCategoryData(no)
      this.getChannelList(no)
    }
   },

   // 获取社群频道目录
   async getCategoryData(id:any){
    if(!isNaN(parseInt(id))){
      const option = { communityNo:parseInt(id), cache:1 };
      const result = await Promise.all(
        [
          post(getChannelList,option).then((res:any)=>{ return res }),
          post(getChannelTree,option).then((res:any)=>{ return res })
        ]
      );
      const tree = result[1]?.data?.treeList;
      const category = result[0]?.data?.list;
      let unreadTree = [];
      if(tree.length !== 0){
        let childrenList = {
          list:[],
          noList:[]
        };
        for(const item of tree){
          if(item.hasOwnProperty('children')){
            const jsonItem = item.children.map((mapItem)=>{
              const jsonProp = JSON.parse(mapItem.props)
              return {
                ...item,
                ...jsonProp
              }
            })
            childrenList.list = jsonItem;
          }else{
            const index = childrenList.noList.findIndex((find:any)=>{
              return find.id === item.id;
            });
            if(index === -1){
              const jsonData = JSON.parse(item.props)
              childrenList.noList.push({...item,...jsonData} as never);
            }
          }
        }
        unreadTree = childrenList.list.concat(childrenList.noList);
      }else{
        unreadTree = [];
      }
      return {tree:tree,category:category,unreadTree:unreadTree};
    }
   },


   // 获取频道数据
   async getChannelList(id:any){
    if(!isNaN(parseInt(id))){
      const option = { communityNo:parseInt(id), cache:1 }
      const res =  await post(getChannelList,option)
      if(res?.data?.list){
        const filterCategoryRes = res?.data?.list.filter((item:any)=>{
         return item.role === 'category'
        })
        const filterTypeChannel = res?.data?.list.filter((item:any)=>{
         return item.role === 'channel'
        })
        this.categoryClass  = filterCategoryRes
        this.channelList = filterTypeChannel
      }
    }
   },

   // 更新社群频道
   async updateChannel(data:any,no:any){
    const res  =  await  post(sUrl("/app/community/channel/updateProfile"),data)
    if(res.status === 1){
      this.getMyCommunity()
      this.getChannelList(no)
      this. getCategoryData(no)
    }
   },

   // 替换数组
   updateCategoryClass(val:any){
    this.categoryClass = val
   },

   // 删除社群频道
   async removeCategory(id:any,no:any){
    const res = await post(deleteCategory,{id:id})
    console.log('查看结果',res);
    if(res.status === 1 && no !== 1){
      this.getMyCommunity()
      this.getCategoryData(no)
      this.getChannelList(no)
    }
   },

   // 更新社群消息提示状态
   updateMsgStatus(){
    const list = (window as any).$TUIKit.store.store.TUIConversation.conversationList;
    const mapList = list.map((item:any)=>{
      const fileInfo = item.groupProfile;
      return {
        groupID:fileInfo.groupID,
        unread:item.unreadCount
      }
    })
    const updateList = this.communityList.map((mapItem:any)=>{
      const isTreeNull = mapItem.tree.length !== 0;
      if(isTreeNull){
        const list = mapItem.tree;
        const updateTree = list.map((item:any)=>{
        const isChildren = item.hasOwnProperty('children');
         if(isChildren){
            if(item.type === 'group'){
              const childrenList = item.children.map((childrenItem:any)=>{
                const jsonItem = JSON.parse(childrenItem.props);
                const findList =  _.find(mapList,function(find:any){ return String(jsonItem.groupID) === String(find.groupID) })
                const option = {
                  ...jsonItem,
                  unread:findList !== undefined ? findList.unread : 0,
                };
                const restJSON = JSON.stringify(option);
                return {...childrenItem,props:restJSON};
              })
              return {
                ...item,
                children:childrenList
              }
            }else{
              return item;
            }
         }else{
          if(item.type === 'group'){
            const jsonData = JSON.parse(item.props);
            const findLists =  _.find(mapList,function(find:any){ return String(jsonData.groupID) === String(find.groupID) })
            const option = {
              ...jsonData,
              unread: findLists !== undefined ? findLists.unread : 0,
            };
            const restJSON = JSON.stringify(option);
            return {...item,props:restJSON};
          }else{
            return item;
          }
         }
        })
        return {
          ...mapItem,
          tree:updateTree,
        }
      }else{
        return mapItem;
      }
    })
    console.log('执行....查看',updateList);
    this.communityList = updateList
   }

  },

  persist:{
    enabled: true,
    strategies: [{
      // 自定义存储的 key，默认是 store.$id
      // 可以指定任何 extends Storage 的实例，默认是 sessionStorage
      storage: localStorage,
      paths: ['myCommunityList','recommendCommunityList','categoryList','categoryClass']
      // state 中的字段名，按组打包储存
    }]
  }
});
