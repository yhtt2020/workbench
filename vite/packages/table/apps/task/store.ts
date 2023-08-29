import { defineStore } from "pinia";
// @ts-ignore
export const taskStore = defineStore("taskStore", {
  state: () => ({
    showTask: true,
  }),
  getters: {},
  actions: {},
  persist: {
    enabled: true,
    strategies: [
      {
        paths: [],
        storage: localStorage,
      },
    ],
  },
});
