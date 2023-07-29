import { defineStore } from "pinia";
// @ts-ignore
export const currencyExchange = defineStore("currencyExchange", {
  state: () => ({
    currencyRateList: {},
  }),
  actions: {},
  persist: {
    enabled: true,
    strategies: [
      {
        paths: [""],
        storage: localStorage,
      },
    ],
  },
});
