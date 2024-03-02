import { defineStore } from "pinia";

// @ts-ignore
export const useGlobalStore = defineStore("useGlobalStore", {
  state: () => ({
    systemVisible: false,
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
