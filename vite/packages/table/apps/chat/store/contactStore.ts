// 联系人的store缓存文件
import { defineStore } from "pinia";

// @ts-ignore
export const contactStore = defineStore("contact", {
  state: () => ({
    currentContact:{
      type: 'group',
      groupID:""
    },
    /**设置通讯录模块的折叠**/
    setting:{
      isCollapse:false,
    } 
  }),
  actions: {},
  persist: {
    enabled: true,
    strategies: [
      {
        paths: ['currentContact','setting'],
        storage: localStorage,
      },
    ],
  },
});
