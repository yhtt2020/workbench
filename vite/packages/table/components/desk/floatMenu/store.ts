import { defineStore } from "pinia";

// @ts-ignore
export const useFloatMenuStore = defineStore("useFloatMenuStore", {
  state: () => ({
    x: 40,
    y: 40,
  }),
  getters: {},
  actions: {},
  persist: {
    enabled: true,
    strategies: [
      {
        paths: ["x", "y"],
        storage: localStorage,
      },
    ],
  },
});
