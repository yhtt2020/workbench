import { defineStore } from "pinia";

// @ts-ignore
export const useAppModalStore = defineStore("useAppModalStore", {
  state: () => ({
    visible: true,
    data: {
      // 用于展示在弹窗左侧
      name: "",
      // 用于展示在弹窗左侧
      logo: "",
      // 用于展示在弹窗主体
      components: "",
    },
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
