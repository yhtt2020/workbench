import {defineStore} from "pinia";
import dbStorage from "../../../store/dbStorage";
import {sUrl} from "../../../consts";
import {post} from "../../../js/axios/request";
import { chatList } from '../../../js/data/chatList';
import _ from 'lodash-es';
import { updateTree } from '../libs/utils';

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
  state:()=>({
    community:{
      communityList:[],
      communityTree:[],
      communityRecommend:[], // 获取社群推荐数据
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

    // 创建社群
    async communityCreate(option:any){
      const res  =  await post(createCommunity, option);
      if(res.status === 1){
        this.getMyCommunity();
        return res;
      }
      else { return res };
    },

    // 获取社群树状频道列表
    getCommunityTree(){
      const list = this.community.communityList;
      const listNull = list.length !== 0;
      if(listNull){
        const newList = [];
        for(const item of list){
          // 去重
          const index = _.findIndex(newList,function(find:any){ return String(find.no) === String(item.no) });
          // 获取no
          const communityNo = item.communityInfo.no;
          // 请求数据配置项
          const option = { communityNo:parseInt(communityNo), cache:1 };
          const channel = post(getChannelList,option).then((res:any)=>{ return res });
          const tree = post(getChannelTree,option).then((res:any)=>{ return res });
          // channel和tree同时进行
          Promise.all([channel,tree]).then((res:any)=>{
            const status = res[0].status === 1 && res[1].status === 1;
            if(status){
              const treeList = res[1].data.treeList;
              const channelList = res[0].data.list;
              const newArr = updateTree(treeList) !== undefined ? updateTree(treeList) : [];
              const option = { no:item.no, tree: newArr, category:channelList};
              if(index === -1){ newList.push(option as never); };
            }
          }); 
        };
        this.community.communityTree = newList
      }
    },

    // 创建社群频道
    async createChannel(option:any,no:any){
      const res  = await post(createChannels,option);
      if(res.status === 1){
        //  this.getCommunityTree();
        const option = { communityNo:parseInt(no), cache:1 };
        post(getChannelTree,option).then((res)=>{
          console.log('执行......测试',res);
          console.log('执行.......查看',this.community.communityTree);
        //  const option = {
        //   no:no,
        //   tree:res.data,
        //  }
       })
       return res;
      }
    },

    // 删除社群频道
    async removeCategory(id:any,no:any){
      console.log('执行.......查看',this.community.communityTree);

      // console.log('执行...删除',id,no);
      // const res = await  post(deleteCategory,{id:id});
      // console.log('执行.....删除结果',res);
      // if(res.status === 1){
      //   this.getCommunityTree();
      //   return res;
      // }
    },

    

  },

  persist:{
    enabled: true,
    strategies:[
      {
        storage:localStorage,
        paths:[],
      }
    ]
  }
})