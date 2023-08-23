import { defineStore } from "pinia";
// @ts-ignore
export const aiStore = defineStore("aiStore", {
  state: () => ({
    temperature: 1,
    count: 4,
    key: "",
    url: "",
    isFull: false, // 组件全屏状态
    selectTab: "Chat", // 左侧tab选中情况
    fullState: {}, // 记录组件展示状态
    // 模板组件数据------------------------------
    mode: "Default",
    isMode: true, // 模板使用中
    // chat组件数据-----------------------------
    // 记录当前请求过的数据
    chatObj: {},
    // topic组件数据----------------------------
    selectTopicIndex: -1,
    // 初始值 提供用于全局状态维护
    defaultData: {
      chat: [],
      icon: {
        name: "",
        id: "",
      },
      id: "",
      time: "",
      name: "",
      top: false,
    },
    // 旧版是对象
    // topicList: [],
    topicList: {},
    serachTopic: "",
    // 下面三个可能不用了 看情况删除
    topList: [],
    todayList: [],
    previousList: [],
  }),
  actions: {},
  persist: {
    enabled: true,
    strategies: [
      {
        paths: ["url", "key", "temperature", "count", "topicList"],
        storage: localStorage,
      },
    ],
  },
});
