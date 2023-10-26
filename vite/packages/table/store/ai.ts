import { defineStore } from "pinia";
// @ts-ignore
export const aiStore = defineStore("aiStore", {
  state: () => ({
    /**
     * 主菜单配置
     */
    gpt: "gpt-3.5-turbo", // 选中的模型
    temperature: 1, // 联想度
    count: 4, // 上下文长度
    key: "sk-rtW2xHFoijpQ6v1huuJlWM8zJDHVfcpi5jtIigB4c668YeR0", // 密钥
    url: "https://api.closeai-proxy.xyz", // 地址
    isFull: false, // 组件全屏状态
    selectTab: "Chat", // 左侧tab选中情况
    fullState: {}, // 记录组件展示状态
    searchState: true,
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
      icon: {
        name: "message",
        id: 0,
      },
      id: "",
      time: "",
      name: "新的对话",
      top: false,
    },
    /**
     * 主题数据和聊天数据
     */
    topicList: {}, // 话题数据
    chatList: {}, // 聊天数据
    // 状态数据
    topList: [],
    todayList: [],
    previousList: [],
    serachTopic: "",
  }),
  getters: {
    recentList() {
      const topicListArray = Object.values(this.topicList);
      if (topicListArray.length == 0) return null;
      topicListArray.sort((a: any, b: any) => b.time - a.time);
      return topicListArray;
    },
    selectTitle() {
      if (this.selectTopicIndex == -1) {
        return "未选择对话";
      }
      return this.topicList[this.selectTopicIndex].name;
    },
  },
  actions: {
    addTopic() {
      // 解构一份初始状态
      let obj = { ...this.defaultData };
      obj.id = Date.now();
      obj.time = Date.now();
      this.selectTopicIndex = obj.id;
      this.topicList[obj.id] = obj;
      this.chatList[obj.id] = [];
      // tsbApi.db.put({
      //   _id: "item:1",
      //   category: "cat1",
      //   content: "content",
      //   createTime: Date.now(),
      //   updateTime: Date.now(),
      // });
    },
    delTopic() {
      for (let key in this.topicList) {
        if (key == this.selectTopicIndex) {
          delete this.topicList[this.selectTopicIndex];
          this.selectTopicIndex = -1;
        }
      }
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        paths: ["url", "key", "temperature", "count", "topicList", "chatList"],
        storage: localStorage,
      },
    ],
  },
});
