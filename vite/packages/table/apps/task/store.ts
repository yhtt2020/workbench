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
    list: [], // 已完成主线
    deskID: 0,
    startBranchTask: [], // 启动的支线任务
    successBranchTask: [], // 完成的支线任务
    // 任务更新时间
    updateTime: "2023-01-05",
    currentUpdateTime: "2023-01-05",
    // 当前任务数据
    currentTaskList: [],
    // 新版任务命名
    startList: [],
    completedList: [],
  }),
  getters: {},
  actions: {
    startfirstTask() {
      this.step = 1;
      this.taskID = "firstTask";
    },
  },
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
          "currentUpdateTime",
          "currentTaskList",
          "startList",
          "completedList",
        ],
        storage: localStorage,
      },
    ],
  },
});
