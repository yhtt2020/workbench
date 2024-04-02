import { defineStore } from "pinia";

// @ts-ignore
export const useModalStore = defineStore("useModalStore", {
  state: () => ({
    modalList: [],
  }),
  getters: {},
  actions: {},
  persist: {
    enabled: true,
    strategies: [
      {
        paths: ["modalList"],
        storage: localStorage,
      },
    ],
  },
});
