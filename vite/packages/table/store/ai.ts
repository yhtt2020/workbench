import { defineStore } from "pinia";
export const aiStore = defineStore("aiStore", {
  state() {
    return {
      isFull: false, // 组件全屏状态
      selectTab: "Chat", // 左侧tab选中情况
      fullState: {}, // 记录组件展示状态
      // 模板组件数据------------------------------
      mode: "Default",
      isMode: true, // 模板使用中
      isssssssssssssMode: 12, // 模板使用中
      // chat组件数据-----------------------------
      // 记录当前请求过的数据
      chatObj: {
        1: ["hello"],
      },
      // topic组件数据----------------------------
      selectTopicIndex: 1,
      // 初始值 提供用于全局状态维护
      defaultData: {
        icon: "",
        time: "",
        name: "",
        top: false,
      },
      topicList: [],
      serachTopic: "",
      topList: [],
      todayList: [],
      previousList: [],
    };
  },
  actions: {},
});
