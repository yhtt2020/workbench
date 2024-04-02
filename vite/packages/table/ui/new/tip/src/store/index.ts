import { defineStore } from "pinia";

export const useTipStore = defineStore("useTipStore", {
    state: () => {
        return {
            tipObj:{}
        }
    },
    actions: {
        
    },
    persist: {
        enabled: true,
        strategies: [
          {
            paths: ['tipObj'],
            storage: localStorage,
          },
        ],
    },
})