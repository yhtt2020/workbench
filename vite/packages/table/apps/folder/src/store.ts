import { defineStore } from "pinia";
// @ts-ignore
export const useFolderStore = defineStore("useFolderStore", {
  state: () => ({
    isDrag: false,
    dragId: "",
    currentData: null,
    currentId: "",

    move:false,
    folderFlag:'',
    focusClose:false, // 导航栏打开文件夹后，失焦后是否自动关闭
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
