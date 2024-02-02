import { defineStore } from "pinia";
import { tasks } from "./page/primary/Primary";
import { tasks as branchTasks } from "./page/branch/Branch";
import { getAllTask } from "./api";
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
    taskAudio: "",
    smallMize:true, // 任务中心最小化
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
    getBranchTask(id) {
      if (!id) return "";
      let res;
      for (const it in branchTasks) {
        let currentIt: any = branchTasks[it];

        currentIt.forEach((i) => {
          if (res) {
            return res;
          }
          res = i.tasks.find((task) => task.id === id);
        });
      }
      console.log("res :>> ", res);
      // const item: any = this.currentTaskList.find(
      //   (obj: any) => obj.name === id
      // );
      return res;
    },
    getTask(id) {
      if (!id) return "";

      const type = id.split("")[0].toUpperCase();
      if (type == "M") {
        return this.getPrimaryTask(id);
      } else if (type == "Z") {
        return this.getBranchTask(id);
      }
    },
    // 初始化任务
    async initTask (){
      let res = await getAllTask();
      
       let { code, data } = res
      
      if (code !== 200) return;
      this.currentTaskList = data;
      const type = "main";
      this.completedList = [];
      data.forEach((item) => {
        if (item.done == 1) this.completedList.push(item.name);
      });
      // 找出主线未完成任务
      let arr = data.filter((obj) => obj.type === type);

      let currentTask = arr.find((item) => {
        if (item.done == 0) return item;
      });

      if (!currentTask) {
        this.taskID = "";
        return;
      }

      this.taskID = currentTask.name;
      this.currentId = currentTask.name;
    }
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
          "claimRewardsList",
        ],
        storage: localStorage,
      },
    ],
  },
});
