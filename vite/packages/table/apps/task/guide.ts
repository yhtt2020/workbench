import { defineStore } from "pinia";
// @ts-ignore
export const guideStore = defineStore("guideStore", {
  state: () => ({
    // 添加卡片
    taskID: "M0101",
    step: 0,
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
