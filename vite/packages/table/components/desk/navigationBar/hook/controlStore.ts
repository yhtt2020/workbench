import { defineStore } from "pinia";
import dbStorage from "../../../../store/dbStorage";

// @ts-ignore
export const controlStore = defineStore("control", {
  state: () => ({
    control: {
      oldList: [
        {
          id: "audio",
        },
        {
          id: "window-control",
          icon: "fluent:window-multiple-16-filled",
          name: "窗口控制",
        },
        {
          icon: "fluent:dark-theme-20-filled",
          id: "light-color-mode",
          name: "浅色模式",
        },
        {
          icon: "fluent:desktop-16-regular",
          id: "min-mode",
          name: "极简模式",
        },
        {
          icon: "fluent:battery-10-16-regular",
          id: "energy-save-mode",
          name: "节能模式",
        },
        {
          icon: "fluent:alert-off-16-regular",
          id: "mute-mode",
          name: "勿扰模式",
        },
        {
          icon: "fluent:accessibility-16-regular",
          id: "assist-mode",
          name: "辅助模式",
        },
        {
          icon:"fluent:code-text-16-regular",
          id:"barrage",
          name:"弹幕"
        },
        {
          id: "user-info",
        },
        {
          icon: "fluent:cursor-click-20-regular",
          id: "shake",
          name: "摇一摇",
        },

        // {
        //   icon: "fluent:games-16-regular",
        //   id: "game-mode",
        //   name: "游戏模式",
        // },
      ],
      newList: [],
    },
    // 数据初始化
    initList: [
      {
        id: "audio",
      },
      {
        id: "window-control",
        icon: "fluent:window-multiple-16-filled",
        name: "窗口控制",
      },
      {
        icon: "fluent:dark-theme-20-filled",
        id: "light-color-mode",
        name: "浅色模式",
      },
      {
        icon: "fluent:desktop-16-regular",
        id: "min-mode",
        name: "极简模式",
      },
      {
        icon: "fluent:battery-10-16-regular",
        id: "energy-save-mode",
        name: "节能模式",
      },
      {
        icon: "fluent:alert-off-16-regular",
        id: "mute-mode",
        name: "勿扰模式",
      },
      {
        icon:"fluent:code-text-16-regular",
        id:"",
        name:"弹幕"
      },
      {
        icon: "fluent:accessibility-16-regular",
        id: "assist-mode",
        name: "辅助模式",
      },
      {
        id: "user-info",
      },
      {
        icon: "fluent:cursor-click-20-regular",
        id: "shake",
        name: "摇一摇",
      },
      // {
      //  icon:'fluent:games-16-regular',id:'game-mode',
      //  name:'游戏模式',
      // },
    ],
  }),

  getters: {
    // 添加
    addControlList() {
      return this.control.oldList;
    },

    // 删除
    removeControlList() {
      return this.control.newList;
    },
  },

  actions: {
    // 用于数据出错时实现数据清空操作
    // initData() {
    //   this.control.newList = []
    //   this.control.oldList = [...this.removeList1];
    // },
  },

  persist: {
    enabled: true,
    strategies: [
      {
        paths: ["control", "initList"],
        // storage: dbStorage,
        storage: localStorage,
      },
    ],
  },
});
