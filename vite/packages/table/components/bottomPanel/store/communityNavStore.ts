import { defineStore } from "pinia";
import { nanoid } from "nanoid";

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
    switchColor: false,
    // 默认选择文件类型的全部
    fileType: "all",
    // 在多个群聊的情况下，当前选中的群聊和选中的下标
    currentCommunity: {
      item: {
        value: "task",
        name: "想天官方社群",
        icon: "/icons/logo128.png",
        bg: "",
        isBg: false,
        mode: "app",
        type: "systemApp",
        id: nanoid(11),
      },
      index: null,
    },
    // 选中当前桌面的id,来获取当前桌面的数据
    currentDesk:{
      id: null,
    },
  }),

  actions: {
    // 将当前选中的社群数据和选中的下标进行解构存储到store
    setCurrentCommunity(item: any,index:any) {
      const { communityInfo } = item;
      const optionItem = {
        value: "task",
        name: communityInfo?.name,
        icon: communityInfo?.icon,
        bg: "",
        isBg: false,
        mode: "app",
        type: "chat",
        id: nanoid(11),
        role: item.role,
        no: communityInfo?.no,
      };
      this.currentCommunity.item = optionItem;
      this.currentCommunity.index = index;
    },
  },

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
          "currentCommunity",
          "currentDesk",
        ],
        storage: localStorage,
      },
    ],
  },
});
