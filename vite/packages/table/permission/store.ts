import { defineStore } from "pinia";
import cache from "../components/card/hooks/cache";
// @ts-ignore
export const usePermissionStore = defineStore("usePermissionStore", {
  state: () => ({
    // 实际使用的token
    token: "",
    // 用户信息
    userInfo: null,
    // 工作台特殊状态
    isOffline: false,
    isSingle: false,
    isGuest: false,
    isLogin: false,
    platform: "h5",
    env: "dev",
    //平台
  }),
  getters: {
  },
  actions: {
    setGuest(boolean){
      this.isGuest = boolean
      cache.set('isGuest',boolean)
    },
    setSingle(boolean){
      this.isSingle = boolean
      cache.set('isSingle',boolean)
    },
    setOffline(boolean){
      this.isOffline = boolean
      cache.set('isOffline',boolean)
    },
  },
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
