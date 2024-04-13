// 联系人的store缓存文件
import { defineStore } from "pinia";

// @ts-ignore
export const contactStore = defineStore("contact", {
  state: () => ({
    currentContact: 'notice',
  }),
  actions: {},
  persist: {
    enabled: true,
    strategies: [
      {
        paths: ['currentContact'],
        storage: localStorage,
      },
    ],
  },
});
