import { defineStore } from "pinia";
import cache from "../components/card/hooks/cache";
import dbStorage from "../store/dbStorage";
// @ts-ignore
export const systemStore = defineStore("systemStore", {
  state: () => ({
    customData: {}
  }),
  getters: {},
  actions: {
  },
  persist: {
    enabled: true,
    strategies: [
      {
        paths: ["customData"],
        storage: dbStorage,
      },
    ],
  },
});
