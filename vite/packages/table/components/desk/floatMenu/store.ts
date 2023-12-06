import { defineStore } from "pinia";

// @ts-ignore
export const useFloatMenuStore = defineStore("useFloatMenuStore", {
  state: () => ({
    x: null,
    y: null,
    menus: [],
  }),
  getters: {},
  actions: {},
  persist: {
    enabled: true,
    strategies: [
      {
        // paths: ["x", "y"],
        storage: localStorage,
      },
    ],
  },
});
