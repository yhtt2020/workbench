import { defineStore } from "pinia";
// @ts-ignore
export const usePermissionStore = defineStore("usePermissionStore", {
  state: () => ({
    // 实际使用的token
    token: "",
    // 用户信息
    userInfo: null,

    isOffline: false,
    isLogin: false,
    isGuest: false,
    platform: "web",
    env: "dev",
    //平台
    // env
    // dev window mac web ，     登录 离线 游客
  }),
  getters: {



  },
  actions: {},
  persist: {
    enabled: true,
    strategies: [
      {
        paths: ["token", "userInfo"],
        storage: localStorage,
      },
    ],
  },
});
