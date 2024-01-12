import { defineStore } from "pinia";
import { tasks } from "./page/primary/Primary";
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
    updateTime: "2023-01-08",
    currentUpdateTime: "2023-01-05",
    // 当前任务数据
    currentTaskList: [],
    // 新版任务命名
    startList: [], // 开始中的任务
    completedList: [], // 以完成的任务
    claimRewardsList: [], // 完成后未点击领取奖励的任务
    rewardVisible: false,
    currentId: "",
    currentType: "",
  }),
  getters: {},
  actions: {
    startfirstTask() {
      this.step = 1;
      this.taskID = "firstTask";
    },
    // 获取当前主线指定ID任务信息
    getPrimaryTask(id) {
      if (!id) return "";

      const foundObject: any = tasks.find((obj) =>
        obj.tasks.find((task) => task.id === id)
      );
      return foundObject.tasks.find((task) => task.id === id);
    },
    getTask(id) {
      if (!id) return "";
      const foundObject: any = tasks.find((obj) =>
        obj.tasks.find((task) => task.id === id)
      );
      return foundObject.tasks.find((task) => task.id === id);
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
          //
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
