import { defineStore } from "pinia";

// @ts-ignore
export const useFloatMenuStore = defineStore("useFloatMenuStore", {
  state: () => ({
    x: null,
    y: null,
    menus: [],
    firstPosition: ['right', 'bottom', -40, -35],
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
