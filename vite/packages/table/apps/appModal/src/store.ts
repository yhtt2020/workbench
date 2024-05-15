import { defineStore } from "pinia";
import { runList } from "./config/data";
// @ts-ignore
export const useAppModalStore = defineStore("useAppModalStore", {
  state: () => ({
    // 运行列表
    runList,
  }),
  getters: {},
  actions: {
    /** 初始化 */
    initApp() {
      // runList
    },
    /** 获取应用 */
    getApp(name: string) {
      let res = this.runList.find((item) => item.name === name);
      return res;
    },
    /** 切换显示状态 */
    switchVisible(name: string, visible?: boolean) {
      let res = this.runList.find((item) => item.name === name);
      if (typeof visible === "boolean") {
        res.visible = visible;
      } else {
        res.visible = !res.visible;
      }
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        paths: ['runList'],
        storage: localStorage,
      },
    ],
  },
});
