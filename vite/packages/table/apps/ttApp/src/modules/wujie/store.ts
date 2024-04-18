import { defineStore } from "pinia";

// @ts-ignore
export const useWuJieStore = defineStore("useWuJieStore", {
  state: () => ({
    data: {},
  }),
  getters: {},
  actions: {

  },
  persist: {
    enabled: true,
    strategies: [
      {
        paths: ["data"],
        storage: localStorage,
      },
    ],
  },
});
