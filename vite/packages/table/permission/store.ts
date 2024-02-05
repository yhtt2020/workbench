import { defineStore } from "pinia";
// @ts-ignore
export const usePermissionStore = defineStore("usePermissionStore", {
  state: () => ({
    token: "",
  }),
  getters: {},
  actions: {
    // 获取当前环境 仅限于固定环境 win mac web mobile
    getCurrentEnv() {
      const userAgent = navigator.userAgent;
      if (
        userAgent.indexOf("天天工作台") > -1 &&
        userAgent.indexOf("Windows") > -1
      ) {
        return "win";
      } else if (
        userAgent.match(
          /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
        )
      ) {
        return "mobile";
      } else if (userAgent.indexOf("Mac") > -1) {
        return "mac";
      }
      return "web";
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        paths: ["token"],
        storage: localStorage,
      },
    ],
  },
});
