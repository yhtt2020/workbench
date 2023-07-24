import { defineStore } from "pinia";
// @ts-ignore
export const useCalculatorStore = defineStore("calculator", {
  state: () => ({
    computeList: [],
    countList: [],
    calculators: 1,
    selectIndex: 0,
  }),
  actions: {},
  persist: {
    enabled: true,
    strategies: [
      {
        paths: ["computeList", "countList", "calculators"],
        storage: localStorage,
      },
    ],
  },
});
