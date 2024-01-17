import { defineStore } from "pinia";
// @ts-ignore
export const useFolderStore = defineStore("useFolderStore", {
  state: () => ({
    isDrag: false,
    dragId: "",
    currentData: null,
    currentId: "",

    move:false,
    folderFlag:''
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
