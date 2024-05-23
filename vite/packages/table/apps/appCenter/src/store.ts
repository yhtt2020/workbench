import { defineStore } from "pinia";

// @ts-ignore
export const useAppCenterStore = defineStore("useAppCenterStore", {
  state: () => ({
    visible: false,
    // 登录回调
    loginCb:()=>{},
    // 我的应用列表
    myApps: [],
    // 当前选中的应用
    current:'MyApps',
    // 最近使用
    recentUsed: true,
    // 默认路径
    defaultPath: require('path').join(window.globalArgs['user-data-dir'], 'download'),
    // 安装路径
    installPath: require('path').join(window.globalArgs['user-data-dir'], 'download'),
    
  }),
  getters: {},
  actions: {},
  persist: {
    enabled: true,
    strategies: [
      {
        paths: ['myApps', 'recentUsed', 'defaultPath', 'installPath'],
        storage: localStorage,
      },
    ],
  },
});
