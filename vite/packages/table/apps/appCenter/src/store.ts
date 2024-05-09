import { defineStore } from "pinia";

// @ts-ignore
export const useAppCenterStore = defineStore("useAppCenterStore", {
  state: () => ({
    visible: false,
    // 登录回调
    loginCb:()=>{},
    // 我的应用列表
    myApps: [],
    // 开始菜单列表
    startMenu: [],
    // 当前选中的应用
    current:'MyApps',
    // 最近使用
    recentUsed: true,
  }),
  getters: {},
  actions: {},
  persist: {
    enabled: true,
    strategies: [
      {
        paths: ['myApps', 'startMenu', 'recentUsed'],
        storage: localStorage,
      },
    ],
  },
});
