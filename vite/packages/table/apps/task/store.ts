import { defineStore } from "pinia";
// @ts-ignore
export const taskStore = defineStore("taskStore", {
  state: () => ({
    firstTask: false, //首次任务
    isTask: true, // 首页展示任务中心
    isTaskDrawer: false, // 打开任务中心
    taskID: "M0101", // 任务ID
    success: false,
    step: -1, // 任务步骤
    list: [],
    deskID: 0,
    startBranchTask: new Set(['Z0000']), // 启动的支线任务
    successBranchTask: new Set(['Z0000']), // 完成的支线任务
  }),
  getters: {},
  actions: {},
  persist: {
    enabled: true,
    strategies: [
      {
        paths: [
          "taskID",
          "list",
          "firstTask",
          "success",
          "isTask",
          "startBranchTask",
          "successBranchTask",
        ],
        storage: localStorage,
      },
    ],
  },
});
