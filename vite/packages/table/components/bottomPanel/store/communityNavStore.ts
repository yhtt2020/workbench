import { defineStore } from "pinia";

// @ts-ignore
export const communityNavStore = defineStore("communityNav", {
  state: () => ({
    // 团队导航数据
    teamNavList: [],
    // 文件应用排序
    layOut: "rows",
    // 应用模式数据结构
    appModalList:[
      {
        name: '我的收藏',
        type: 'like',
        rename: null,
        list:[],
      },
      {
        name:'全部',
        type:'all',
        rename: null,
      }
    ],
    // 应用模式下的下标
    appFolderIndex:1,
  }),

  actions: {},

  persist: {
    enabled: true,
    strategies: [
      {
        paths: ["teamNavList", "layOut","appModalList","appFolderIndex"],
        storage: localStorage,
      },
    ],
  },
});
