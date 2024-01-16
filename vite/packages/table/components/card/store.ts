import { defineStore } from "pinia";
import dbStorage from "../../store/dbStorage";

// @ts-ignore
export const useWidgetStore = defineStore("useWidgetStore", {
  state: () => ({
    rightModel: "default",
    edit: false,
    firstOpen: false,
  }),
  getters: {

  },
  actions: {},
  persist: {
    enabled: true,
    strategies: [
      {
        paths: ["rightModel", 'firstOpen'],
        storage: dbStorage,
      },
    ],
  },
});
