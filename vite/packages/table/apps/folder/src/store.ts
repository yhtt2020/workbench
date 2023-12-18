import { defineStore } from "pinia";
// @ts-ignore
export const useFolderStore = defineStore("useFolderStore", {
  state: () => ({
    isDrag: false,
    dragId: "",
    currentData: null,
    currentId: "",

    // 进入文件夹状态
    isEnter: false,
    // 离开文件夹状态
    isOver: false,
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
