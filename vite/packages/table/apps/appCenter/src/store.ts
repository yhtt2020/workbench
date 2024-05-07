import { defineStore } from "pinia";

// @ts-ignore
export const useAppCenterStore = defineStore("useAppCenterStore", {
  state: () => ({
    visible: false,
    // 登录回调
    loginCb:()=>{},
    // 我的应用列表
    myApps: [],
  }),
  getters: {},
  actions: {},
  persist: {
    enabled: true,
    strategies: [
      {
        paths: [],
        storage: localStorage,
      },
    ],
  },
});
