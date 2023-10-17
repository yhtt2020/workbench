import { defineStore } from "pinia";
import dbStorage from "../../store/dbStorage";

// @ts-ignore
export const useWidgetStore = defineStore("useWidgetStore", {
  state: () => ({
    rightModel: "default",
    isOnCard: false,
  }),
  getters: {},
  actions: {},
  persist: {
    enabled: true,
    strategies: [
      {
        paths: ["rightModel"],
        storage: dbStorage,
      },
    ],
  },
});
