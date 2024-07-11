import { defineStore } from "pinia";

// @ts-ignore
export const gameGuideStore = defineStore("gameGuide", {
  state: () => ({
    gameAppId: "",
  }),
  actions: {},
  persist: {
    enabled: true,
    strategies: [
      {
        storage: localStorage,
        paths: ["gameAppId"],
      },
    ],
  },
});
