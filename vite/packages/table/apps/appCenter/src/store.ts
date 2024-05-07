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
  }),
  getters: {},
  actions: {},
  persist: {
    enabled: true,
    strategies: [
      {
        paths: ['myApps','startMenu'],
        storage: localStorage,
      },
    ],
  },
});
