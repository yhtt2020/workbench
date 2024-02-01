import { defineStore } from "pinia";
import dbStorage from "../../store/dbStorage";

// @ts-ignore
export const useTTAppStore = defineStore("useTTAppStore", {
  state: () => ({}),
  getters: {},
  actions: {},
  persist: {
    enabled: true,
    strategies: [
      {
        paths: [],
        storage: dbStorage,
      },
    ],
  },
});
