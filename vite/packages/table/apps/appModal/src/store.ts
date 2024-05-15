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
    getApp(name: string) {
      let res = this.runList.find((item) => item.name === name);
      console.log("res :>> ", res);

      return res;
    },
    /** 切换显示状态 */
    switchVisible(name: string) {
      let res = this.runList.find((item) => item.name === name);
      res.visible = !res.visible;
    },
  },
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
