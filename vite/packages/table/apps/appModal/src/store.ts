import { defineStore } from "pinia";

// @ts-ignore
export const useAppModalStore = defineStore("useAppModalStore", {
  state: () => ({
    // 运行列表
    runList: [
      {
        name: "ai",
        cname: "AI助手",
        icon: "/logo/ai.svg",
        iconType: "select",
        visible: false,
        width: "1000px",
        height: "752px",
      },
      {
        name: "note",
        visible: false,
      },
    ],
  }),
  getters: {},
  actions: {
    getApp(name: string) {
      let res = this.runList.find((item) => item.name === name);
      console.log("res :>> ", res);

      return res;
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
