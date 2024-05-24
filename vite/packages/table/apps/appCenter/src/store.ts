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
    recentUsed: false,
    // 默认路径
    defaultPath: require('path').join(window.globalArgs['user-data-dir'], 'download'),
    // 安装路径
    installPath: require('path').join(window.globalArgs['user-data-dir'], 'download'),
    // 提示显示
    showTip: true,
    
  }),
  getters: {},
  actions: {},
  persist: {
    enabled: true,
    strategies: [
      {
        paths: ['myApps', 'recentUsed', 'defaultPath', 'installPath', 'showTip'],
        storage: localStorage,
      },
    ],
  },
});
