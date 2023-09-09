import { defineStore } from "pinia";
// @ts-ignore
export const taskStore = defineStore("taskStore", {
  state: () => ({
    isTask: true, // 首页展示任务中心
    isTaskDrawer: false, // 打开任务中心
    taskID: "M0101", // 任务ID
    success: false,
    step: -1, // 任务步骤
    list: [],
  }),
  getters: {},
  actions: {},
  persist: {
    enabled: true,
    strategies: [
      {
        paths: ["taskID", "list"],
        storage: localStorage,
      },
    ],
  },
});
