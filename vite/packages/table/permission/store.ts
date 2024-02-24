import { defineStore } from "pinia";
// @ts-ignore
export const usePermissionStore = defineStore("usePermissionStore", {
  state: () => ({
    token: "",
  }),
  getters: {},
  actions: {
  },
  persist: {
    enabled: true,
    strategies: [
      {
        paths: ["token"],
        storage: localStorage,
      },
    ],
  },
});
