import { defineStore } from "pinia";

// @ts-ignore
export const useTTAppStore = defineStore("useTTAppStore", {
  state: () => ({
    aapList: [],
  }),
  getters: {},
  actions: {},
  persist: {
    enabled: true,
    strategies: [
      {
        paths: ["aapList"],
        storage: localStorage,
      },
    ],
  },
});
