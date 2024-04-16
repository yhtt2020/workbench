import { defineStore } from "pinia";
// @ts-ignore
export const usePermissionStore = defineStore("usePermissionStore", {
  state: () => ({
    // 实际使用的token
    token: "",
    /**
     * 这个变量不会记录token 只作为标记
     * 如果取过旧版token，就不再取了
     */
    retrievedOldTokenFlag: false,
    // 用户信息
    userInfo: {},
  }),
  getters: {},
  actions: {},
  persist: {
    enabled: true,
    strategies: [
      {
        paths: ["token", "retrievedOldTokenFlag"],
        storage: localStorage,
      },
    ],
  },
});
