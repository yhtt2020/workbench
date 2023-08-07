import { defineStore } from "pinia";
// @ts-ignore
export const colorSelection = defineStore("colorSelection", {
  state: () => ({
    colorList: ["#ffffff"],
  }),
  actions: {},
  persist: {
    enabled: true,
    strategies: [
      {
        paths: ["colorList"],
        storage: localStorage,
      },
    ],
  },
});
