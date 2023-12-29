import { defineStore, storeToRefs } from "pinia";

import dbStorage from "../../../store/dbStorage";
// @ts-ignore
export const useDeskStore = defineStore("useDeskStore", {
  state: () => ({
    autoOpenEdit: false,
  }),
  getters: {},
  actions: {},
  persist: {
    enabled: true,
    strategies: [
      {
        paths: ["autoOpenEdit"],
        // storage: localStorage,
        storage: dbStorage,
      },
    ],
  },
});
