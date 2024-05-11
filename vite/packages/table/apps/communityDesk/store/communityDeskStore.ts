// 社群桌面数据
import { defineStore } from "pinia";
import _ from "lodash-es";

// @ts-ignore
export const communityDeskStore = defineStore("communityDesk", {
  state: () => ({
    // 指定社群中的所有桌面列表
    communityDesk: {
      communityDeskNo: "",
      communityAllDesk: [],
      // communityDeskList是用于存档的列表  结构 {name:"桌面名称",id:"桌面id"}
      communityDeskList: [],
    },

    // 当前桌面数据
    currentCommunityDesk: {},
  }),

  actions: {
    // 设置当前桌面数据
    setCurrentDesk(data: any) {},

    // 设置当前社群所有桌面,这里只添加桌面名称以及桌面id
    setCommunityDeskAllId(data: any) {
      const index = _.findIndex(
        this.communityDesk.communityDeskList,
        (item: any) => {
          return String(data.id) === String(item.id);
        }
      );
      if (index === -1) {
        this.communityDesk.communityDeskList.push(data);
      }
    },

    // 指定社群桌面进行本地存储
    setLocalCommunityDesk(data:any){
      const index = _.findIndex(this.communityDesk.communityAllDesk,(desk:any)=>{
        return String(desk.id) === String(data.id);
      })
      if(index === -1){
        this.communityDesk.communityAllDesk.push(data);
      }
    },

    // 同步指定社群所有桌面数据
    sysCurrentAllDesk(){
      
    },
  },

  persist: {
    enabled: true,
    strategies: [
      {
        paths: ["communityDesk", "currentCommunityDesk"],
        storage: localStorage,
      },
    ],
  },
});
