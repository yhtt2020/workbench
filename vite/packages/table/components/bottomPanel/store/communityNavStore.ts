import { defineStore } from "pinia";

// @ts-ignore
export const communityNavStore = defineStore("communityNav", {
  state: () => ({
    // 文件应用排序
    layOut: "rows",
    // 应用模式数据结构
    appModalList: [
      {
        name: "我的收藏",
        type: "like",
        rename: null,
      },
      {
        name: "全部",
        type: "all",
        rename: null,
        list: [],
      },
    ],
    // 应用模式下的下标
    appFolderIndex: 1,
    // 开启设置模式
    settingEnable: false,
    // 社群导航-应用模式-设置模式-模式选择 (默认选中应用模式)
    settingType: "component",
    // 开启自定义图标背景色
    switchColor:false,
    // 默认选择文件类型的全部
    fileType: "all",
    
  }),

  actions: {},

  persist: {
    enabled: true,
    strategies: [
      {
        paths: [
          "layOut",
          "appModalList",
          "appFolderIndex",
          "settingEnable",
          "settingType",
          "switchColor",
        ],
        storage: localStorage,
      },
    ],
  },
});
