import { defineStore } from "pinia";

// @ts-ignore
export const useGlobalStore = defineStore("useGlobalStore", {
  state: () => ({
    //系统设置显示
    systemVisible: false,
    // 登录显示
    loginVisible: false,
    // 登录回调
    loginCb: () => {},
    windowWidth: 0,
    windowHeight: 0,
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
