import {defineStore} from "pinia";
import dbStorage from "../../../store/dbStorage";
import {sUrl} from "../../../consts";
import {post} from "../../../js/axios/request";
import { chatList } from '../../../js/data/chatList';
import _ from 'lodash-es';
import { updateTree ,communityTotal} from '../libs/utils';

const createCommunity = sUrl("/app/community/create"); // 创建社群
const getMyCommunity = sUrl("/app/community/my")  // 我的社群
const getRecommendCommunity = sUrl("/app/community/getRecommendList") // 获取推荐社群
const applyJoin = sUrl("/app/community/join") // 申请加入社群
const searchRecommendCommunity = sUrl("/app/community/searchCommunity") // 搜索
const getChannelList = sUrl("/app/community/channel/getList") // 获取频道列表
const getChannelTree = sUrl("/app/community/channel/getTreeList") // 获取树状频道
const createChannels = sUrl("/app/community/channel/create") // 创建社群频道
const deleteCategory = sUrl("/app/community/channel/remove") // 删除社群频道
const updateChannel = sUrl("/app/community/channel/updateProfile") // 更新社群频道

// @ts-ignore
export const communityStore = defineStore('communityStore',{
  state:()=>({
    community:{
      communityList:[], // 获取社群左侧列表
      communityRecommend:[], // 获取社群推荐数据
      categoryClass:[], // 用于存储新分组
      communityTree:[], // 获取社群树状列表
    }
  }),

  actions:{
    // 获取推荐社群
    getRecommendCommunityList(){
      post(getRecommendCommunity,{}).then((res:any)=>{
        const status = res.status; // 判断是否请求成功
        if(status === 1){
          const resNull = res.data !== undefined; // 预防报错
          if(resNull){
            this.community.communityRecommend = res.data;
          }
        }
      });
    },
    // 搜索推荐社群
    async searchRecommendCommunity(data:any){
      const res = await post(searchRecommendCommunity,{keywords:data});
      if(res.status === 1){
        const list = res?.data?.list;
        return list;
      } 
    },
    // 加入推荐群聊
    async joinRecommendCommunity(option:any){
      const res = await post(applyJoin,option);
      if(res.status === 1){
        return res.data;
      }
    },
    // 获取社群左侧初始数据
    getMyCommunity(){
      post(getMyCommunity,{}).then((res)=>{
        if(res.status === 1){
          const list = res?.data?.list
          const mapList = list.map((mapItem:any)=>{
            const isCommunityInfo = mapItem.hasOwnProperty('communityInfo');
            if(isCommunityInfo){
              // 取出data下的数据进行操作,预防报错处理
              const data = mapItem?.communityInfo;
              // 将数据进行解构返回出去
              const returnOption = {
                ...data,
                summary:null,
                uid:mapItem.uid,
                ...mapItem,
                unread:0,
              }
              return returnOption;
            }
          })
          const filterUndefined = _.filter(mapList,function(filterItem:any){
            if(filterItem !== undefined){
              return filterItem;
            }
          })
          this.community.communityList = filterUndefined;
        }
      });
    },

    // 获取社群树状频道列表
    getCommunityTree(){
      const list = this.community.communityList;
      if(list.length !== 0){
        const newList = [];
        for(const item of list){
          // 请求数据配置项
          const option = { communityNo:parseInt(item.no), cache:1 };
          const channel = post(getChannelList,option).then((res:any)=>{ return res });
          const tree = post(getChannelTree,option).then((res:any)=>{ return res });
          Promise.all([channel,tree]).then((res:any)=>{
            const status = res[0].status === 1 && res[1].status === 1;
            if(status){
              const treeList = res[1].data.treeList;
              const channelList = res[0].data.list;
              const newArr = updateTree(treeList) !== undefined ? updateTree(treeList) : [];
              const option = { no:item.no, tree: newArr, category:channelList};
              const index = _.findIndex(newArr,function(find:any){ return String(find.no) === String(item.no) });
              if(index === -1){
                newList.push(option as never);
              }
             }
          }); 
        }
        this.community.communityTree = newList;
      }
    },

    // 创建社群
    async communityCreate(option:any){
      const res  =  await post(createCommunity, option);
      if(res.status === 1){
        this.getMyCommunity();
        this.getCommunityTree();
        return res;
      }
      else { return res };
    },
   

    // 更新社群树状对应数据
    async updateCommunityTree(no:any){
      const list = this.community.communityTree;
      const listNull = list.length !== 0;
      if(listNull){
        // 请求数据配置项
        const option = { communityNo:parseInt(no), cache:1 };
        const channel = post(getChannelList,option).then((res:any)=>{ return res });
        const tree = post(getChannelTree,option).then((res:any)=>{ return res });
        const result = await Promise.all([channel,tree]);
        const status = result[1].status === 1;
        const treeList = result[1].data.treeList;
        if(status){
          const newArr = updateTree(treeList) !== undefined ? updateTree(treeList) : [];
          const mapData = this.community.communityTree.map((mapItem:any)=>{
            const isMap = String(mapItem.no) === String(no);
            if(isMap){ return { no:parseInt(no), tree: newArr, category:result[0].data.list }; }
            else { return {...mapItem};}
          })
          this.community.communityTree = mapData;
        }
      }
    },
    // 创建社群频道
    async createChannel(option:any,no:any){
      const res  = await post(createChannels,option);      
      if(res.status === 1){
        this.updateCommunityTree(no);
        return res;
      }
    },

    // 删除社群频道
    async removeCategory(id:any,no:any){
      const res = await  post(deleteCategory,{id:id});
      if(res.status === 1){
        this.updateCommunityTree(no);
        return res;
      }
    },

    // 获取社群分组
    getChannelList(no:any){
      const isNum = isNaN(parseInt(no));
      if(!isNum){
        const option = { communityNo:parseInt(no), cache:1 };
        post(getChannelList,option).then((res:any)=>{
          console.log('执行......查看',res);
        })
      }
    },

    // 更新社群父级目录
    async updateCategoryData(data:any,no:any){
      const res = await post(updateChannel,data);
      console.log('执行......更新',res);
    }
    
  },

  persist:{
    enabled: true,
    strategies:[
      {
        storage:localStorage,
        paths:['community'],
      }
    ]
  }
})